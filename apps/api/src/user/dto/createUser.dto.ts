import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../typeorm/entities/user/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
