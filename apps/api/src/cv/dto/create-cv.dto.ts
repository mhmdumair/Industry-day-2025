import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  studentID: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  filePath: string;
}