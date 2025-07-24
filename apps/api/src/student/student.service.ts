import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/typeorm/entities/user/student.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private readonly userService: UserService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const createdUser = await this.userService.createUser(createStudentDto.user);

      const student = this.studentRepository.create({
        ...createStudentDto.student,
        userID: createdUser.userID,
      });

      return await this.studentRepository.save(student);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  async findOne(id: string): Promise<Student | null> {
    try {
      return await this.studentRepository.findOne({ where: { studentID: id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student');
    }
  }

  async findByUserId(userId: string): Promise<Student | null> {
    try {
      return await this.studentRepository.findOne({ where: { userID: userId } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch student by userID');
    }
  }

  async filterByGroupAndLevel(group?: string, level?: string): Promise<Student[]> {
    try {
      const where: any = {};
      if (group) where.group = group;
      if (level) where.level = level;
      return await this.studentRepository.find({ where });
    } catch (error) {
      throw new InternalServerErrorException('Failed to filter students');
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({ where: { studentID: id } });

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

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
