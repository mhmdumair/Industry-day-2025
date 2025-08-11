// DTOs
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  studentID: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;
}

export class CreateCvByRegnoDto {
  @IsNotEmpty()
  @IsString()
  regNo: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;
}