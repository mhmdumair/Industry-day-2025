import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { StallStatus } from '../entities/stall.entity';

export class CreateStallDto {
  @IsUUID()
  @IsNotEmpty()
  roomID: string;

  @IsUUID()
  @IsNotEmpty()
  companyID: string;

  @IsEnum(StallStatus)
  status: StallStatus;
}
