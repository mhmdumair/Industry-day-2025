import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../typeorm/entities';
import { Stall } from '../typeorm/entities';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,

    @InjectRepository(Stall)
    private readonly stallRepository: Repository<Stall>,
  ) {}

  async create(createInterviewDto: CreateInterviewDto) {
    try {
      const interview = this.interviewRepository.create(createInterviewDto);
      return await this.interviewRepository.save(interview);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create interview');
    }
  }

  async bulkCreate(createInterviewDtos: CreateInterviewDto[]) {
    const successful: Interview[] = [];
    const failed: { dto: CreateInterviewDto; error: string }[] = [];

    for (let i = 0; i < createInterviewDtos.length; i++) {
      try {
        const dto = createInterviewDtos[i];
        const interview = this.interviewRepository.create(dto);
        const saved = await this.interviewRepository.save(interview);
        successful.push(saved);
      } catch (error) {
        failed.push({
          dto: createInterviewDtos[i],
          error: error.message || 'Failed to create interview',
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: createInterviewDtos.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

  async findAll() {
    try {
      return await this.interviewRepository.find({
        relations: ['student', 'stall'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve interviews');
    }
  }

  async findOne(id: string) {
    try {
      const interview = await this.interviewRepository.findOne({
        where: { interviewID: id },
        relations: ['student', 'stall'],
      });
      if (!interview) {
        throw new NotFoundException(`Interview with ID ${id} not found`);
      }
      return interview;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve interview');
    }
  }

  async update(id: string, updateInterviewDto: UpdateInterviewDto) {
    try {
      const updateResult = await this.interviewRepository.update({ interviewID: id }, updateInterviewDto);
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Interview with ID ${id} not found`);
      }
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update interview');
    }
  }

  async remove(id: string) {
    try {
      const deleteResult = await this.interviewRepository.delete({ interviewID: id });
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Interview with ID ${id} not found`);
      }
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove interview');
    }
  }

  async findByStudentId(studentID: string) {
    try {
      return await this.interviewRepository.find({
        where: { studentID },
        relations: ['student', 'stall'],
      });
    } catch {
      throw new InternalServerErrorException('Failed to retrieve interviews by studentID');
    }
  }

  async findByStallId(stallID: string) {
    try {
      return await this.interviewRepository.find({
        where: { stallID },
        relations: ['student', 'stall'],
      });
    } catch {
      throw new InternalServerErrorException('Failed to retrieve interviews by stallID');
    }
  }

  async findByCompanyId(companyID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoin('interview.stall', 'stall')
        .leftJoinAndSelect('interview.student', 'student')
        .where('stall.companyID = :companyID', { companyID })
        .getMany();
    } catch {
      throw new InternalServerErrorException('Failed to retrieve interviews by companyID');
    }
  }

  async findByRoomId(roomID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoin('interview.stall', 'stall')
        .leftJoinAndSelect('interview.student', 'student')
        .where('stall.roomID = :roomID', { roomID })
        .getMany();
    } catch {
      throw new InternalServerErrorException('Failed to retrieve interviews by roomID');
    }
  }

  async getPrelistedSorted(stallID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoinAndSelect('interview.student', 'student')
        .where('interview.stallID = :stallID', { stallID })
        .andWhere('interview.type = :type', { type: 'pre-listed' })
        .orderBy('interview.student_preference', 'ASC')
        .addOrderBy('interview.company_preference', 'ASC')
        .addOrderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve prelisted interviews');
    }
  }

  async getWalkinSorted(stallID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoinAndSelect('interview.student', 'student')
        .where('interview.stallID = :stallID', { stallID })
        .andWhere('interview.type = :type', { type: 'walk-in' })
        .orderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve walkin interviews');
    }
  }


async getPrelistedByCompany(companyID: string) {
  try {
    return await this.interviewRepository
      .createQueryBuilder('interview')
      .innerJoin('interview.stall', 'stall')
      .leftJoinAndSelect('interview.student', 'student')
      .where('stall.companyID = :companyID', { companyID })
      .andWhere('interview.type = :type', { type: 'pre-listed' })
      .orderBy('interview.student_preference', 'ASC')
      .addOrderBy('interview.company_preference', 'ASC')
      .addOrderBy('interview.created_at', 'ASC')
      .getMany();
  } catch (error) {
    throw new InternalServerErrorException('Failed to retrieve prelisted interviews by company');
  }
}

async getWalkinByCompany(companyID: string) {
  try {
    return await this.interviewRepository
      .createQueryBuilder('interview')
      .innerJoin('interview.stall', 'stall')
      .leftJoinAndSelect('interview.student', 'student')
      .where('stall.companyID = :companyID', { companyID })
      .andWhere('interview.type = :type', { type: 'walk-in' })
      .orderBy('interview.created_at', 'ASC')
      .getMany();
  } catch (error) {
    throw new InternalServerErrorException('Failed to retrieve walk-in interviews by company');
  }
}

}
