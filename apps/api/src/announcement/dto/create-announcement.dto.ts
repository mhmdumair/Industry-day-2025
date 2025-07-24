import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AudienceType } from '../../typeorm/entities/announcements/announcement.entity'

export class CreateAnnouncementDto {
  @IsNotEmpty()
  @IsString()
  announcementID: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(AudienceType)
  audienceType: AudienceType;

  @IsNotEmpty()
  @IsString()
  postedByUserID: string;
}
