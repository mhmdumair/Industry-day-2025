import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { InterviewType, InterviewStatus } from '../entities/interview.entity';

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  stallID?: string;

  @IsOptional()
  @IsString()
  studentID?: string;

  @IsOptional()
  @IsString()
  companyID?: string;

  @IsOptional()
  @IsEnum(InterviewType)
  type?: InterviewType;

  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

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
  company_preference?: number;
}