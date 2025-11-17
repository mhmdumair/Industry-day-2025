import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { StudentLevel } from '../entities/student.entity';

export class StudentDto {
  @IsString()
  regNo: string;

  @IsOptional()
  @IsString()
  nic?: string;

  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsString()
  group: string;

  @IsEnum(StudentLevel)
  level: StudentLevel;
}

export class CreateStudentDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => StudentDto)
  student: StudentDto;
}

