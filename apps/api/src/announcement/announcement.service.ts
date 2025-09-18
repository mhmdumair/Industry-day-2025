// src/announcement/announcement.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './../typeorm/entities';
import { AudienceType } from './entities/announcement.entity';
import { CompanyService } from '../company/company.service';

@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(Announcement)
        private readonly announcementRepository: Repository<Announcement>,
        private companyService: CompanyService
    ) {}

    private async addAuthorName(announcement: Announcement): Promise<Announcement & { author_name: string }> {
        let authorName = 'SIIC';
        if (announcement.postedByUser?.role === 'company') {
            const companyName = await this.companyService.getCompanyNameByUserId(announcement.postedByUserID);
            authorName = companyName || 'SIIC';
        }
        return {
            ...announcement,
            author_name: authorName
        };
    }

    private async addAuthorNamesToMultiple(announcements: Announcement[]): Promise<(Announcement & { author_name: string })[]> {
        return await Promise.all(
            announcements.map(announcement => this.addAuthorName(announcement))
        );
    }

    async create(createAnnouncementDto: CreateAnnouncementDto, postedByUserID: string): Promise<Announcement> {
        try {
            const announcement = this.announcementRepository.create({
                ...createAnnouncementDto,
                postedByUserID: postedByUserID, 
            });
            return await this.announcementRepository.save(announcement);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create announcement');
        }
    }

    async findAll(): Promise<(Announcement & { author_name: string })[]> {
        try {
            const announcements = await this.announcementRepository.find({
                relations: ['postedByUser'],
                order: { created_at: 'DESC' },
            });
            return await this.addAuthorNamesToMultiple(announcements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            throw new InternalServerErrorException('Failed to fetch announcements');
        }
    }

    async findOne(id: string): Promise<(Announcement & { author_name: string }) | null> {
        try {
            const announcement = await this.announcementRepository.findOne({
                where: { announcementID: id },
                relations: ['postedByUser'],
            });
            if (!announcement) {
                throw new NotFoundException(`Announcement with ID ${id} not found`);
            }
            return await this.addAuthorName(announcement);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch announcement');
        }
    }

    async findForStudents(): Promise<(Announcement & { author_name: string })[]> {
        try {
            const announcements = await this.announcementRepository.find({
                where: [
                    { audienceType: AudienceType.STUDENTS },
                    { audienceType: AudienceType.ALL }
                ],
                relations: ['postedByUser'],
                order: { created_at: 'DESC' },
            });
            return await this.addAuthorNamesToMultiple(announcements);
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch announcements for students');
        }
    }

    async findForCompanies(): Promise<(Announcement & { author_name: string })[]> {
        try {
            const announcements = await this.announcementRepository.find({
                where: [
                    { audienceType: AudienceType.COMPANIES },
                    { audienceType: AudienceType.ALL }
                ],
                relations: ['postedByUser'],
                order: { created_at: 'DESC' },
            });
            return await this.addAuthorNamesToMultiple(announcements);
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch announcements for companies');
        }
    }

    async findByUserId(userId: string): Promise<(Announcement & { author_name: string })[]> {
        try {
            const announcements = await this.announcementRepository.find({
                where: { postedByUserID: userId },
                relations: ['postedByUser'],
                order: { created_at: 'DESC' },
            });
            return await this.addAuthorNamesToMultiple(announcements);
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

    async getAnnouncementCount(audienceType: AudienceType): Promise<number> {
        try {
            return await this.announcementRepository.count({
                where: { audienceType },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to get announcement count');
        }
    }
}