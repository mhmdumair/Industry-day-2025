// src/announcement/dto/create-announcement.dto.ts
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AudienceType } from '../entities/announcement.entity';

export class CreateAnnouncementDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(AudienceType)
  audienceType: AudienceType;
}