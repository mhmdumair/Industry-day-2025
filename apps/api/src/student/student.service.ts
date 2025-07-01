import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/typeorm/entities/user/student.entity';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository:Repository<Student>,
    private readonly userService: UserService
  ){}
  async create(createStudentDto: CreateStudentDto) {
    const userDto = createStudentDto.user;
    const user = await this.userService.createUser(userDto)
    const student = await this.studentRepository.create({
      ...createStudentDto,
      userID: user.userID, // Ensure the student is linked to the user
    });
    return this.create(createStudentDto)
  }

  async findAll() : Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { studentID: id } });
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
