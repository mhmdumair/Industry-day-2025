import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

export enum StudentGroup {
  ZL = 'ZL',
  BT = 'BT',
  CH = 'CH',
  MT = 'MT',
  BMS = 'BMS',
  ST = 'ST',
  GL = 'GL',
  CS = 'CS',
  DS = 'DS',
  ML = 'ML',
  BL = 'BL',
  MB = 'MB',
  CM = 'CM',
  AS = 'AS',
  ES = 'ES',
  SOR = 'SOR',
}

export enum StudentLevel {
  LEVEL_1000 = 'level_1',
  LEVEL_2000 = 'level_2',
  LEVEL_3000 = 'level_3',
  LEVEL_4000 = 'level_4',
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
