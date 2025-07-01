import { IsString, IsNotEmpty, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

export enum StudentGroup {
  GROUP_A = 'group_a',
  GROUP_B = 'group_b',
  GROUP_C = 'group_c',
}

export enum StudentLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
}

export class StudentDto {


  @IsString()
  @IsNotEmpty()
  studentID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  regNo: string;

  @IsString()
  @IsNotEmpty()
  nic: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsEnum(StudentGroup)
  @IsNotEmpty()
  group: StudentGroup;

  @IsEnum(StudentLevel)
  @IsNotEmpty()
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