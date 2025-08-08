import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomAdminDto } from './create-room-admin.dto';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';

export class UpdateRoomAdminDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  roomID?: string;
}
