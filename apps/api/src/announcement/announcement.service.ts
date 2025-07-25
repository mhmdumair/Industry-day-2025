import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement} from './../typeorm/entities';
import {AudienceType } from '..//typeorm/entities/announcements/announcement.entity'
import  {CompanyService}  from '../company/company.service';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement) 
    private readonly announcementRepository: Repository<Announcement>,
    private companyService: CompanyService
  ) {}

  // CREATE - Add new announcement
  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    try {
      const announcement = this.announcementRepository.create(createAnnouncementDto);
      return await this.announcementRepository.save(announcement);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create announcement');
    }
  }

  async findAll(): Promise<Announcement[]> {
  try {
    const announcements = await this.announcementRepository.find({
      relations: ['postedByUser'],
      order: { created_at: 'DESC' }, 
    });

    // Process each announcement to add author_name
    const processedAnnouncements = await Promise.all(
      announcements.map(async (announcement) => {
        let authorName = 'SIIC'; // Default for admin users

        if (announcement.postedByUser.role === 'company') {
          // Fetch company name using your existing method
          const companyName = await this.companyService.getCompanyNameByUserId(announcement.postedByUserID);
          authorName = companyName || 'SIIC'; // Fallback to SIIC if company name not found
        }

        return {
          ...announcement,
          author_name: authorName
        };
      })
    );

    return processedAnnouncements;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw new InternalServerErrorException('Failed to fetch announcements');
  }
}


  async findOne(id: string): Promise<Announcement | null> {
    try {
      const announcement = await this.announcementRepository.findOne({ 
        where: { announcementID: id },
        relations: ['postedByUser'],
      });
      
      if (!announcement) {
        throw new NotFoundException(`Announcement with ID ${id} not found`);
      }
      
      return announcement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch announcement');
    }
  }

  async findForStudents(): Promise<Announcement[]> {
    try {
      return await this.announcementRepository.find({ 
        where: [
          { audienceType: AudienceType.STUDENTS },
          { audienceType: AudienceType.ALL } // Students also see ALL announcements
        ],
        relations: ['postedByUser'],
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch announcements for students');
    }
  }

  async findForCompanies(): Promise<Announcement[]> {
    try {
      return await this.announcementRepository.find({ 
        where: [
          { audienceType: AudienceType.COMPANIES },
          { audienceType: AudienceType.ALL } // Companies also see ALL announcements
        ],
        relations: ['postedByUser'],
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch announcements for companies');
    }
  }

  async findByUserId(userId: string): Promise<Announcement[]> {
    try {
      return await this.announcementRepository.find({ 
        where: { postedByUserID: userId },
        relations: ['postedByUser'],
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch announcements by userID');
    }
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
    try {
      const announcement = await this.announcementRepository.findOne({ 
        where: { announcementID: id } 
      });
      
      if (!announcement) {
        throw new NotFoundException(`Announcement with ID ${id} not found`);
      }

      const updatedAnnouncement = this.announcementRepository.merge(announcement, updateAnnouncementDto);
      return await this.announcementRepository.save(updatedAnnouncement);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update announcement');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const announcement = await this.announcementRepository.findOne({ 
        where: { announcementID: id } 
      });
      
      if (!announcement) {
        throw new NotFoundException(`Announcement with ID ${id} not found`);
      }

      await this.announcementRepository.remove(announcement);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete announcement');
    }
  }
}
