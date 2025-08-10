// src/feedback/dto/create-feedback.dto.ts
import { IsNotEmpty, IsUUID, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsUUID()
  userID: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}