import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional, IsDate,
} from 'class-validator';
import { UserRole } from '../../typeorm/entities/user/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  google_id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
