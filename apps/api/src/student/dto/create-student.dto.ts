import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { StudentGroup, StudentLevel } from '../entities/student.entity';

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

export { StudentGroup} from '../entities/student.entity';
