import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../typeorm/entities/announcements/announcement.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports:[TypeOrmModule.forFeature([Announcement]),CompanyModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}



