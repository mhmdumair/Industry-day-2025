import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../typeorm/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

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

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
