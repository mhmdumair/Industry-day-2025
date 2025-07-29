import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InterviewStatus, InterviewType } from '../entities/interview.entity';

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
}
