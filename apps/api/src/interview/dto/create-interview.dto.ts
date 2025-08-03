import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { InterviewType, InterviewStatus } from '../entities/interview.entity';

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  stallID: string;

  @IsString()
  @IsNotEmpty()
  studentID: string;

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
