import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

export enum StudentGroup {
  ZL = 'ZL', BT = 'BT', CH = 'CH', MT = 'MT', BMS = 'BMS', ST = 'ST',
  GL = 'GL', CS = 'CS', DS = 'DS', ML = 'ML', BL = 'BL', MB = 'MB',
  CM = 'CM', AS = 'AS', ES = 'ES', SOR = 'SOR',
}

export enum StudentLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
}

export class StudentDto {
  @IsOptional()
  @IsString()
  regNo?: string | null;

  @IsOptional()
  @IsString()
  nic?: string | null;

  @IsOptional()
  @IsString()
  contact?: string | null;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsEnum(StudentGroup)
  group: StudentGroup;

  @IsOptional()
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
