import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { InterviewType, InterviewStatus } from '../entities/interview.entity';

export class CreateInterviewDto {
  @IsString()
  @IsOptional()
  stallID: string;

  @IsString()
  @IsNotEmpty()
  studentID: string;

  @IsString()
  @IsNotEmpty()
  companyID :string

  @IsEnum(InterviewType)
  type: InterviewType;

  @IsEnum(InterviewStatus)
  status: InterviewStatus;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  student_preference?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  company_preference: number;
}

export class CreateInterviewByRegNoDto{
  @IsString()
  @IsNotEmpty()
  regNo :string;

  @IsString()
  @IsNotEmpty()
  companyID :string;

  @IsEnum(InterviewType)
  type :InterviewType

}