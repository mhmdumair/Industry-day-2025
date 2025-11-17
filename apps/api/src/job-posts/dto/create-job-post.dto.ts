import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateJobPostDto {
  @IsNotEmpty()
  @IsUUID()
  companyID: string;
}