import { ValidateNested, IsOptional, IsString, IsEnum, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from '../../user/dto/updateUser.dto';
import { StudentLevel } from '../entities/student.entity';

export class UpdateStudentDto {

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
  @IsString()
  group?: string;

  @IsOptional()
  @IsEnum(StudentLevel)
  level?: StudentLevel;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
