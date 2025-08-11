import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsString, IsUUID, IsOptional } from 'class-validator';
import { CreateStallDto } from './create-stall.dto';
import { StallStatus, Preference } from '../entities/stall.entity';

export class UpdateStallDto extends PartialType(CreateStallDto) {
  @IsUUID()
  @IsOptional()
  roomID?: string;

  @IsUUID()
  @IsOptional()
  companyID?: string;

  @IsEnum(StallStatus)
  @IsOptional()
  status?: StallStatus;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(Preference)
  @IsOptional()
  preference?: Preference;
}
