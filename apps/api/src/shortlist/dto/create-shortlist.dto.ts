import { IsNotEmpty, IsString } from "class-validator";

export class CreateShortlistDto {
  @IsString()
  @IsNotEmpty()
  companyID: string;

  @IsString()
  @IsNotEmpty()
  studentID: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
