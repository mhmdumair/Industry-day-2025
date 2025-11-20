import { Injectable, NotFoundException, InternalServerErrorException, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { UserService } from 'src/user/user.service';
import { StudentCv } from 'src/typeorm/entities';
import { CvService } from 'src/cv/cv.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CvService)) 
    private readonly cvService: CvService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(StudentCv) private readonly cvRepository: Repository<StudentCv>, 
  ) {}

  private async _executeCreateStudent(
    createStudentDto: CreateStudentDto,
    manager: EntityManager,
  ): Promise<Student> {
    const createdUser = await this.userService.createUserTransactional(
      createStudentDto.user,
      manager
    );

    const student = manager.create(Student, {
      ...createStudentDto.student,
      userID: createdUser.userID,
    });

    return await manager.save(Student, student);
  }

  async register(
  createStudentDto: CreateStudentDto,
  file: Express.Multer.File,
): Promise<Student> {
  const queryRunner = this.studentRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let savedStudent: Student;
  let uploadedFileId: string | null = null; 

  try {
    savedStudent = await this._executeCreateStudent(
      createStudentDto,
      queryRunner.manager
    );
    
    const studentID = savedStudent.studentID;

    const cleanedRegNo = savedStudent.regNo.replace(/\//g, ''); 
    const originalExtension = file.originalname.split('.').pop();
    const driveFilename = `${cleanedRegNo}.${originalExtension}`;

    const driveFileId = await this.cvService.uploadCvFile(
      file,
      driveFilename,
    );
    uploadedFileId = driveFileId; 

    const cvRecord = queryRunner.manager.create(this.cvRepository.target, {
        studentID: studentID,
        fileName: driveFileId,
    });
    await queryRunner.manager.save(cvRecord); 

    await queryRunner.commitTransaction();
    return savedStudent;

  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (uploadedFileId) {
      console.warn(`Attempting cleanup of Drive file ${uploadedFileId} after DB failure.`);
      try {
        await this.cvService.deleteCvFile(uploadedFileId); 
      } catch (cleanupError) {
        console.error(`Failed to cleanup Drive file ${uploadedFileId}:`, cleanupError.message);
      }
    }

    throw new InternalServerErrorException(
      `Failed to register student and CV: ${error.message}`
    );
  } finally {
    await queryRunner.release();
  }
}

  async updateProfilePicture(studentID: string, file: Express.Multer.File): Promise<User> {
    const student = await this.findOne(studentID);
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentID} not found.`);
    }

    // 1. Fetch User to get old public ID and userID
    const user = await this.userService.fetchUserById(student.userID);
    if (!user) {
        throw new NotFoundException('Associated user account not found.');
    }

    const oldPublicId = user.profile_picture_public_id;

    // 2. Delegate the full transactional upload/delete/save logic to UserService
    const updatedUser = await this.userService.updateProfilePicture(
        user.userID,
        file,
        oldPublicId
    );
    
    return updatedUser;
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const queryRunner = this.studentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedStudent = await this._executeCreateStudent(
        createStudentDto,
        queryRunner.manager
      );
      
      await queryRunner.commitTransaction();
      return savedStudent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create student: ${error.message}`
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createBulk(createStudentDtos: CreateStudentDto[]): Promise<{
    successful: Student[];
    failed: { index: number; dto: CreateStudentDto; error: string }[];
    summary: { total: number; successful: number; failed: number };
  }> {
    const successful: Student[] = [];
    const failed: { index: number; dto: CreateStudentDto; error: string }[] = [];

    for (let i = 0; i < createStudentDtos.length; i++) {
      try {
        const dto = createStudentDtos[i];
        const createdStudent = await this.create(dto);
        successful.push(createdStudent);
      } catch (error) {
        failed.push({
          index: i,
          dto: createStudentDtos[i],
          error: error.message || 'Failed to create student',
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: createStudentDtos.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

 async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.user', 'user')
        .orderBy(`CAST(SUBSTRING(student.regNo, 2) AS UNSIGNED)`, 'ASC')
        .addOrderBy('student.regNo', 'ASC') 
        .getMany();
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw new InternalServerErrorException('Failed to fetch students');
    }
    }

  async findOne(id: string): Promise<Student | null> {
    try {
      return await this.studentRepository.findOne({ 
        where: { studentID: id },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student');
    }
  }

  async findByUserId(userId: string): Promise<Student | null> {
    try {
      return await this.studentRepository.findOne({ 
        where: { userID: userId },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student by userID');
    }
  }

  async findByRegNo(regNo: string): Promise<Student | null> {
    try {
      return await this.studentRepository.findOne({ 
        where: { regNo: regNo },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student by registration number');
    }
  }

  async filterByGroupAndLevel(group?: string, level?: string): Promise<Student[]> {
    try {
      const where: any = {};
      if (group) where.group = group;
      if (level) where.level = level;
      return await this.studentRepository.find({ 
        where,
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to filter students');
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const queryRunner = this.studentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const student = await queryRunner.manager.findOne(Student, {
        where: { studentID: id },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      // Update student fields (excluding user)
      const { user: userDto, ...studentFields } = updateStudentDto;
      
      // Merge only the student-specific fields
      Object.assign(student, studentFields);

      // Update user fields if provided
      if (userDto) {
        await this.userService.updateUserInTransaction(
          student.userID,
          userDto,
          queryRunner.manager
        );
      }

      // Save the updated student
      await queryRunner.manager.save(Student, student);

      await queryRunner.commitTransaction();

      // Fetch and return the complete student with updated user relations
      const updatedStudent = await this.studentRepository.findOne({
        where: { studentID: id },
        relations: ['user'],
      });

      if (!updatedStudent) {
        throw new NotFoundException(`Student with ID ${id} not found after update`);
      }

      return updatedStudent;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update student: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const student = await this.studentRepository.findOne({ 
        where: { studentID: id } 
      });
      
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      
      await this.studentRepository.remove(student);
      return { message: `Student ${id} removed successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove student');
    }
  }
}