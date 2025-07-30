import { ValidateNested, IsOptional, IsString, IsEnum, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from '../../user/dto/updateUser.dto'; // You should define this too
import { StudentGroup } from './create-student.dto';
import { StudentLevel } from '../entities/student.entity';

export class UpdateStudentDto {
  // studentID and userID omitted intentionally

  @IsOptional()
  @IsString()
  regNo?: string;

  @IsOptional()
  @IsString()
  nic?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsEnum(StudentGroup)
  group?: StudentGroup;

  @IsOptional()
  @IsEnum(StudentLevel)
  level?: StudentLevel;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
