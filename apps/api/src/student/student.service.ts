import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student, StudentGroup, StudentLevel } from 'src/typeorm/entities/user/student.entity';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository:Repository<Student>,
    private readonly userService: UserService,
  ){}


  async create(createStudentDto: CreateStudentDto): Promise<Student> {
  const createdUser = await this.userService.createUser(createStudentDto.user);

  const student = this.studentRepository.create({
    ...createStudentDto.student,  // Access student properties here
    userID: createdUser.userID,   // Link to created user
  });

  return this.studentRepository.save(student);
}



  async findAll() : Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { studentID: id } });
  }

  findByUserId(userId:string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { userID: userId } });

  }

  
  async filterByGroupAndLevel(group?: string, level?: string): Promise<Student[]> {
    const where: any = {};
    if (group) where.group = group;
    if (level) where.level = level;
    return this.studentRepository.find({ where });
  }


  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    // Find the existing student
    const student = await this.studentRepository.findOne({ where: { studentID: id } });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    
    // Merge the updates into the existing student entity
    const updatedStudent = this.studentRepository.merge(student, updateStudentDto);
    
    // Save and return the updated student
    return this.studentRepository.save(updatedStudent);
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
