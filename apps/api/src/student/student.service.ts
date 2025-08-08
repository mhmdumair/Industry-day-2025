import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private readonly userService: UserService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const queryRunner = this.studentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create user within the transaction
      const createdUser = await this.userService.createUserTransactional(
        createStudentDto.user,
        queryRunner.manager
      );

      // Create student within the same transaction
      const student = queryRunner.manager.create(Student, {
        ...createStudentDto.student,
        userID: createdUser.userID,
      });

      const savedStudent = await queryRunner.manager.save(Student, student);
      
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

  // Updated bulk creation method with proper transaction handling
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
      return await this.studentRepository.find({
        relations: ['user'],
      });
    } catch (error) {
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

  // Find student by registration number
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
    try {
      const student = await this.studentRepository.findOne({
        where: { studentID: id },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      const updatedStudent = this.studentRepository.merge(student, updateStudentDto);
      return await this.studentRepository.save(updatedStudent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update student');
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
