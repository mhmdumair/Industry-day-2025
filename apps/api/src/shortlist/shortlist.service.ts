import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateShortlistDto } from './dto/create-shortlist.dto';
import { UpdateShortlistDto } from './dto/update-shortlist.dto';
import { CompanyShortlist } from '../typeorm/entities';

@Injectable()
export class ShortlistService {
  constructor(
    @InjectRepository(CompanyShortlist)
    private shortlistRepository: Repository<CompanyShortlist>,
  ) {}

  async create(createShortlistDto: CreateShortlistDto): Promise<CompanyShortlist> {
    try {
      if (!createShortlistDto.companyID || !createShortlistDto.studentID || !createShortlistDto.description) {
        throw new BadRequestException('Company ID, Student ID, and description are required');
      }

      // Check if shortlist already exists for this company-student combination
      const existingShortlist = await this.shortlistRepository.findOne({
        where: {
          companyID: createShortlistDto.companyID,
          studentID: createShortlistDto.studentID,
        },
      });

      if (existingShortlist) {
        throw new ConflictException('Student is already shortlisted for this company');
      }

      const shortlist = this.shortlistRepository.create(createShortlistDto);
      return await this.shortlistRepository.save(shortlist);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Invalid data provided or foreign key constraint violation');
      }
      
      throw new InternalServerErrorException('Failed to create shortlist');
    }
  }

  async findAll(): Promise<CompanyShortlist[]> {
    try {
      return await this.shortlistRepository.find({
        relations: ['company', 'student'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve shortlists');
    }
  }

  async findOne(id: string): Promise<CompanyShortlist> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Shortlist ID is required');
      }

      const shortlist = await this.shortlistRepository.findOne({
        where: { shortlistID: id },
        relations: ['company', 'student'],
      });
      
      if (!shortlist) {
        throw new NotFoundException(`Shortlist with ID ${id} not found`);
      }
      
      return shortlist;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve shortlist');
    }
  }

  async findByStudentId(studentId: string): Promise<CompanyShortlist[]> {
    try {
      if (!studentId || studentId.trim() === '') {
        throw new BadRequestException('Student ID is required');
      }

      const shortlists = await this.shortlistRepository.find({
        where: { studentID: studentId },
        relations: ['company', 'student'],
      });

      return shortlists; 
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve shortlists for student');
    }
  }

  async findByCompanyId(companyId: string): Promise<CompanyShortlist[]> {
    try {
      if (!companyId || companyId.trim() === '') {
        throw new BadRequestException('Company ID is required');
      }

      const shortlists = await this.shortlistRepository.find({
        where: { companyID: companyId },
        relations: ['company', 'student'],
      });

      return shortlists; 
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve shortlists for company');
    }
  }

  async update(id: string, updateShortlistDto: UpdateShortlistDto): Promise<CompanyShortlist> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Shortlist ID is required');
      }

      if (!updateShortlistDto || Object.keys(updateShortlistDto).length === 0) {
        throw new BadRequestException('At least one field must be provided for update');
      }

      const shortlist = await this.findOne(id); 

      if (updateShortlistDto.companyID || updateShortlistDto.studentID) {
        const companyID = updateShortlistDto.companyID || shortlist.companyID;
        const studentID = updateShortlistDto.studentID || shortlist.studentID;

        const existingShortlist = await this.shortlistRepository.findOne({
          where: {
            companyID,
            studentID,
          },
        });

        if (existingShortlist && existingShortlist.shortlistID !== id) {
          throw new ConflictException('Student is already shortlisted for this company');
        }
      }

      Object.assign(shortlist, updateShortlistDto);
      return await this.shortlistRepository.save(shortlist);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Invalid data provided or foreign key constraint violation');
      }
      
      throw new InternalServerErrorException('Failed to update shortlist');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Shortlist ID is required');
      }

      const shortlist = await this.findOne(id);
      await this.shortlistRepository.remove(shortlist);
      
      return { message: `Shortlist with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete shortlist');
    }
  }
}
