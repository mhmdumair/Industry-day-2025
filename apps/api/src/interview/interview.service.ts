import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThan } from 'typeorm';
import { Interview, InterviewType, InterviewStatus } from './entities/interview.entity';
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

  async getNextWalkinInterview(companyID: string, stallID: string, interviewCount: number = 1) {
    try {
      const nextInterviews = await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoin('interview.stall', 'stall')
        .leftJoinAndSelect('interview.student', 'student')
        .where('stall.companyID = :companyID', { companyID })
        .andWhere('interview.type = :type', { type: InterviewType.WALK_IN })
        .andWhere('interview.status = :status', { status: InterviewStatus.SCHEDULED })
        .orderBy('interview.created_at', 'ASC')
        .limit(interviewCount)
        .getMany();

      if (!nextInterviews || nextInterviews.length === 0) {
        throw new NotFoundException('No scheduled walk-in interviews found for this company');
      }

      const interviewIDs = nextInterviews.map(interview => interview.interviewID);
      
      await this.interviewRepository.update(
        { interviewID: In(interviewIDs) },
        { stallID }
      );

      return await this.interviewRepository.find({
        where: { interviewID: In(interviewIDs) },
        relations: ['student', 'stall'],
        order: { created_at: 'ASC' }
      });

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get next walk-in interview(s)');
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

  // New method: Remove pre-listed interview with preference adjustment
  async removePrelistedInterview(id: string) {
    try {
      // Start a transaction to ensure data consistency
      return await this.interviewRepository.manager.transaction(async manager => {
        // First, get the interview to be deleted
        const interviewToDelete = await manager.findOne(Interview, {
          where: { interviewID: id },
        });

        if (!interviewToDelete) {
          throw new NotFoundException(`Interview with ID ${id} not found`);
        }

        // Only process if it's a pre-listed interview
        if (interviewToDelete.type !== InterviewType.PRE_LISTED) {
          // For non-pre-listed interviews, just delete normally
          const deleteResult = await manager.delete(Interview, { interviewID: id });
          return { deleted: true };
        }

        const companyID = interviewToDelete.companyID;
        const deletedPreference = interviewToDelete.company_preference;

        // Delete the interview
        await manager.delete(Interview, { interviewID: id });

        // Update all pre-listed interviews for the same company with higher preferences
        await manager
          .createQueryBuilder()
          .update(Interview)
          .set({
            company_preference: () => 'company_preference - 1'
          })
          .where('companyID = :companyID', { companyID })
          .andWhere('type = :type', { type: InterviewType.PRE_LISTED })
          .andWhere('company_preference > :deletedPreference', { deletedPreference })
          .execute();

        return { deleted: true, preferencesAdjusted: true };
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove pre-listed interview');
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

  async getPrelistedByCompany(companyID: string) {
    try {
      return await this.interviewRepository
          .createQueryBuilder('interview')
          .leftJoinAndSelect('interview.student', 'student')
          .leftJoinAndSelect('student.user', 'user') // Include user details
          .leftJoinAndSelect('interview.stall', 'stall')
          .where('interview.companyID = :companyID', { companyID })
          .andWhere('interview.type = :type', { type: InterviewType.PRE_LISTED })
          .orderBy('interview.company_preference', 'ASC')
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
        .andWhere('interview.type = :type', { type: InterviewType.WALK_IN })
        .orderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve walk-in interviews by company');
    }
  }

  async getPrelistedScheduledByCompany(companyID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoin('interview.stall', 'stall')
        .leftJoinAndSelect('interview.student', 'student')
        .where('stall.companyID = :companyID', { companyID })
        .andWhere('interview.type = :type', { type: InterviewType.PRE_LISTED })
        .andWhere('interview.status = :status', { status: InterviewStatus.SCHEDULED })
        .orderBy('interview.student_preference', 'ASC')
        .addOrderBy('interview.company_preference', 'ASC')
        .addOrderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve pre-listed scheduled interviews by company');
    }
  }

  async getWalkinScheduledByCompany(companyID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoin('interview.stall', 'stall')
        .leftJoinAndSelect('interview.student', 'student')
        .where('stall.companyID = :companyID', { companyID })
        .andWhere('interview.type = :type', { type: InterviewType.WALK_IN })
        .andWhere('interview.status = :status', { status: InterviewStatus.SCHEDULED })
        .orderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve walk-in scheduled interviews by company');
    }
  }

  async getWalkinCountByCompany(companyID: string): Promise<{ count: number }> {
    try {
      const count = await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoin('interview.stall', 'stall')
        .where('stall.companyID = :companyID', { companyID })
        .andWhere('interview.type = :type', { type: InterviewType.WALK_IN })
        .andWhere('interview.status = :status', { status: InterviewStatus.SCHEDULED })
        .getCount();
      return { count };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get scheduled walk-in count by company');
    }
  }

  async getPrelistedSortedByStudent(studentID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoinAndSelect('interview.student', 'student')
        .leftJoinAndSelect('interview.stall', 'stall')
        .where('interview.studentID = :studentID', { studentID })
        .andWhere('interview.type = :type', { type: InterviewType.PRE_LISTED })
        .orderBy('interview.student_preference', 'ASC')
        .addOrderBy('interview.company_preference', 'ASC')
        .addOrderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve prelisted interviews sorted by preferences for student');
    }
  }

  async getWalkinSortedByStudent(studentID: string) {
    try {
      return await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoinAndSelect('interview.student', 'student')
        .leftJoinAndSelect('interview.stall', 'stall')
        .where('interview.studentID = :studentID', { studentID })
        .andWhere('interview.type = :type', { type: InterviewType.WALK_IN })
        .orderBy('interview.created_at', 'ASC')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve walkin interviews sorted by creation date for student');
    }
  }
}