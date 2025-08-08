import { IsEnum, IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { StallStatus, Preference } from '../entities/stall.entity';

export class CreateStallDto {
  @IsUUID()
  @IsNotEmpty()
  roomID: string;

  @IsUUID()
  @IsNotEmpty()
  companyID: string;

  @IsEnum(StallStatus)
  status: StallStatus;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Preference)
  @IsOptional()
  preference?: Preference;
}
