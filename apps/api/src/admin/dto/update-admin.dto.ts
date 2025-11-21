import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}