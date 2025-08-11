import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Interview,
  InterviewType,
  InterviewStatus,
} from './entities/interview.entity';
import { CreateInterviewByRegNoDto, CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Student } from '../student/entities/student.entity';
import { Stall } from '../stall/entities/stall.entity';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Stall)
    private stallRepository: Repository<Stall>,
    private studentSerrvice: StudentService
  ) {}

  private async renumberPreferences(companyID: string): Promise<void> {
    try {
      const list = await this.interviewRepository.find({
        where: { companyID, type: InterviewType.PRE_LISTED },
        order: { company_preference: 'ASC' },
      });

      let changed = false;
      list.forEach((iv, idx) => {
        const target = idx + 1;
        if (iv.company_preference !== target) {
          iv.company_preference = target;
          changed = true;
        }
      });

      if (changed) await this.interviewRepository.save(list);
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to renumber preferences: ${err.message}`,
      );
    }
  }

  private async nextCompanyPreference(companyID: string): Promise<number> {
    try {
      const row = await this.interviewRepository
        .createQueryBuilder('i')
        .select('MAX(i.company_preference)', 'max')
        .where('i.companyID = :companyID', { companyID })
        .andWhere('i.type = :type', { type: InterviewType.PRE_LISTED })
        .getRawOne<{ max: string | null }>();

      const maxPref = row?.max ? Number(row.max) : 0;
      return maxPref + 1;
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get next company preference: ${err.message}`,
      );
    }
  }

  async create(dto: CreateInterviewDto): Promise<Interview> {
    try {
      const interview = this.interviewRepository.create(dto);
      return await this.interviewRepository.save(interview);
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to create interview: ${err.message}`,
      );
    }
  }

  async createPrelist(dto: Partial<CreateInterviewDto>): Promise<Interview> {
    try {
      if (!dto.companyID) {
        throw new BadRequestException('companyID must be provided for a pre-listed interview.');
      }

      const interview = this.interviewRepository.create({
        ...dto,
        type: InterviewType.PRE_LISTED,
        status: InterviewStatus.INQUEUE,
        stallID: undefined,
        company_preference: await this.nextCompanyPreference(dto.companyID),
      });
      return await this.interviewRepository.save(interview);
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to create pre-list interview: ${err.message}`,
      );
    }
  }

  async createWalkin(dto: Partial<CreateInterviewDto>): Promise<Interview> {
    try {
      const interview = this.interviewRepository.create({
        ...dto,
        type: InterviewType.WALK_IN,
        status: InterviewStatus.SCHEDULED,
        stallID: undefined,
      });
      return await this.interviewRepository.save(interview);
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to create walk-in interview: ${err.message}`,
      );
    }
  }

  async bulkCreate(
    dtos: CreateInterviewDto[],
  ): Promise<{
    successful: Interview[];
    failed: { index: number; dto: CreateInterviewDto; error: string }[];
    summary: { total: number; successful: number; failed: number };
  }> {
    const successful: Interview[] = [];
    const failed: { index: number; dto: CreateInterviewDto; error: string }[] =
      [];

    for (let i = 0; i < dtos.length; i++) {
      try {
        successful.push(await this.create(dtos[i]));
      } catch (err) {
        failed.push({
          index: i,
          dto: dtos[i],
          error: err.message || 'Failed to create interview',
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: dtos.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

  async bulkCreatePrelist(
    dtos: CreateInterviewDto[],
  ): Promise<{
    successful: Interview[];
    failed: { index: number; dto: CreateInterviewDto; error: string }[];
    summary: { total: number; successful: number; failed: number };
  }> {
    const successful: Interview[] = [];
    const failed: { index: number; dto: CreateInterviewDto; error: string }[] =
      [];

    const prefs: Record<string, number> = {};
    const companyIDs = [...new Set(dtos.map(d => d.companyID))];
    
    try {
      await Promise.all(companyIDs.map(id => this.renumberPreferences(id)));

      await Promise.all(
        companyIDs.map(async id => {
          prefs[id] = await this.nextCompanyPreference(id) - 1;
        }),
      );
    } catch(err) {
      throw new InternalServerErrorException(`Failed to prepare prelist batch: ${err.message}`);
    }

    for (let i = 0; i < dtos.length; i++) {
      try {
        const dto = dtos[i];
        prefs[dto.companyID] += 1;

        const interview = this.interviewRepository.create({
          ...dto,
          type: InterviewType.PRE_LISTED,
          status: InterviewStatus.INQUEUE,
          stallID: undefined,
          company_preference: prefs[dto.companyID],
        });

        successful.push(await this.interviewRepository.save(interview));
      } catch (err) {
        failed.push({
          index: i,
          dto: dtos[i],
          error: err.message || 'Failed to create pre-list interview',
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: dtos.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

  async createInterviewByRegNo(
    dto: CreateInterviewByRegNoDto,
  ): Promise<Interview> {
    try {
      const student = await this.studentSerrvice.findByRegNo(dto.regNo);
      if (!student) {
        throw new NotFoundException(
          `Student with registration number ${dto.regNo} not found`,
        );
      }

      const baseDto: Partial<CreateInterviewDto> = {
        companyID: dto.companyID,
        studentID: student.studentID,
      };

      if (dto.type === InterviewType.PRE_LISTED) {
        return this.createPrelist(baseDto);
      } else {
        return this.createWalkin(baseDto);
      }
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to create interview by registration number: ${err.message}`,
      );
    }
  }

  async findAll() {
    try {
      return this.interviewRepository.find({
        relations: ['stall', 'student', 'student.user'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to retrieve interviews: ${err.message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return this.interviewRepository.findOne({
        where: { interviewID: id },
        relations: ['stall', 'student', 'student.user'],
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to retrieve interview: ${err.message}`,
      );
    }
  }

  async findByStudentId(studentID: string) {
    try {
      return this.interviewRepository.find({
        where: { studentID },
        relations: ['stall', 'student', 'student.user'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to find interviews by student ID: ${err.message}`,
      );
    }
  }

  async findByStallId(stallID: string) {
    try {
      return this.interviewRepository.find({
        where: { stallID, status: InterviewStatus.INQUEUE },
        relations: ['stall', 'student', 'student.user'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to find interviews by stall ID: ${err.message}`,
      );
    }
  }

  async findByCompanyId(companyID: string) {
    try {
      return this.interviewRepository.find({
        where: { companyID },
        relations: ['stall', 'student', 'student.user'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to find interviews by company ID: ${err.message}`,
      );
    }
  }

  private prelistOrder = {
    student_preference: 'ASC' as const,
    company_preference: 'ASC' as const,
  };

  async getPrelistedByCompany(companyID: string) {
    try {
      return this.interviewRepository.find({
        where: { companyID, type: InterviewType.PRE_LISTED },
        relations: ['stall', 'student', 'student.user'],
        order: this.prelistOrder,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get pre-listed interviews by company: ${err.message}`,
      );
    }
  }

  async getPrelistedScheduledByCompany(companyID: string) {
    try {
      return this.interviewRepository.find({
        where: {
          companyID,
          type: InterviewType.PRE_LISTED,
          status: InterviewStatus.INQUEUE,
        },
        relations: ['stall', 'student', 'student.user'],
        order: this.prelistOrder,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get scheduled pre-listed interviews: ${err.message}`,
      );
    }
  }

  async getWalkinByCompany(companyID: string) {
    try {
      return this.interviewRepository.find({
        where: { companyID, type: InterviewType.WALK_IN },
        relations: ['stall', 'student', 'student.user'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get walk-in interviews by company: ${err.message}`,
      );
    }
  }

  async getWalkinScheduledByCompany(companyID: string) {
    try {
      return this.interviewRepository.find({
        where: {
          companyID,
          type: InterviewType.WALK_IN,
          status: InterviewStatus.SCHEDULED,
        },
        relations: ['stall', 'student', 'student.user'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get scheduled walk-in interviews: ${err.message}`,
      );
    }
  }

  async getWalkinCountByCompany(companyID: string) {
    try {
      const count = await this.interviewRepository.count({
        where: { companyID, type: InterviewType.WALK_IN },
      });
      return { count };
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get walk-in count: ${err.message}`,
      );
    }
  }

  async getNextWalkinInterview(
    companyID: string,
    stallID: string,
    count = 1,
  ): Promise<Interview[]> {
    try {
      const stall = await this.stallRepository.findOne({ where: { stallID } });
      if (!stall) throw new NotFoundException('Stall not found');

      const stream = stall.preference;

      let qb = this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoinAndSelect('interview.student', 'student')
        .leftJoinAndSelect('student.user', 'user')
        .where('interview.companyID = :companyID', { companyID })
        .andWhere('interview.type = :type', { type: InterviewType.WALK_IN })
        .andWhere('interview.status = :status', {
          status: InterviewStatus.SCHEDULED,
        })
        .andWhere('interview.stallID IS NULL');

      if (stream !== 'ALL') {
        qb = qb
          .addSelect(
            `CASE WHEN student.group LIKE :like THEN 0 ELSE 1 END`,
            'priority',
          )
          .setParameter('like', `%${stream}%`)
          .orderBy('priority', 'ASC')
          .addOrderBy('student.level', 'DESC');
      }

      qb = qb
        .addOrderBy('student.level', 'DESC')
        .addOrderBy('interview.created_at', 'ASC')
        .limit(count);

      const scheduledInterviews = await qb.getMany();

      if (scheduledInterviews.length === 0) {
        return [];
      }
      const interviewIDsToUpdate = scheduledInterviews.map(
        (interview) => interview.interviewID,
      );

      await this.interviewRepository
        .createQueryBuilder()
        .update(Interview)
        .set({
          status: InterviewStatus.INQUEUE,
          stallID: stallID,
        })
        .whereInIds(interviewIDsToUpdate)
        .execute();

      const updatedInterviews = await this.interviewRepository
        .createQueryBuilder('interview')
        .leftJoinAndSelect('interview.student', 'student')
        .leftJoinAndSelect('student.user', 'user')
        .whereInIds(interviewIDsToUpdate)
        .getMany();

      return updatedInterviews;
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get next walk-in interviews: ${err.message}`,
      );
    }
  }

  async getPrelistedSortedByStudent(studentID: string) {
    try {
      return this.interviewRepository.find({
        where: { studentID, type: InterviewType.PRE_LISTED },
        relations: ['stall', 'student', 'student.user','company'],
        order: this.prelistOrder,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get pre-listed interviews by student: ${err.message}`,
      );
    }
  }

  async getWalkinSortedByStudent(studentID: string) {
    try {
      return this.interviewRepository.find({
        where: { studentID, type: InterviewType.WALK_IN },
        relations: ['stall', 'student', 'student.user','company'],
        order: { created_at: 'ASC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get walk-in interviews by student: ${err.message}`,
      );
    }
  }

  async update(id: string, dto: UpdateInterviewDto) {
    try {
      const interview = await this.findOne(id);
      if (!interview)
        throw new NotFoundException(`Interview with ID ${id} not found`);

      this.interviewRepository.merge(interview, dto);
      return this.interviewRepository.save(interview);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to update interview: ${err.message}`,
      );
    }
  }

  async updateStatus(id: string, status: InterviewStatus) {
    try {
      const interview = await this.findOne(id);
      if (!interview) {
        throw new NotFoundException(`Interview with ID ${id} not found`);
      }
      interview.status = status;
      return this.interviewRepository.save(interview);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to update interview status: ${err.message}`,
      );
    }
  }

  scheduleInterview(id: string) {
    return this.updateStatus(id, InterviewStatus.SCHEDULED);
  }

  async completeInterview(id: string) {
    try {
      const interview = await this.findOne(id);
      if (!interview) {
        throw new NotFoundException(`Interview with ID ${id} not found`);
      }
      
      interview.status = InterviewStatus.COMPLETED;
      return this.interviewRepository.save(interview);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to complete interview: ${err.message}`,
      );
    }
  }

  cancelInterview(id: string) {
    return this.updateStatus(id, InterviewStatus.CANCELLED);
  }

  async remove(id: string) {
    try {
      const interview = await this.findOne(id);
      if (!interview)
        throw new NotFoundException(`Interview with ID ${id} not found`);

      await this.interviewRepository.remove(interview);
      return { message: `Interview ${id} removed successfully` };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to remove interview: ${err.message}`,
      );
    }
  }

  async removePrelistedInterview(id: string) {
    try {
      const interview = await this.interviewRepository.findOne({
        where: { interviewID: id, type: InterviewType.PRE_LISTED },
      });
      if (!interview)
        throw new NotFoundException(
          `Pre-listed interview with ID ${id} not found`,
        );

      const companyID = interview.companyID;
      await this.interviewRepository.remove(interview);
      
      await this.renumberPreferences(companyID);
      
      return { message: `Pre-listed interview ${id} removed successfully` };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to remove pre-listed interview: ${err.message}`,
      );
    }
  }

  async setStudentPreference(
    id: string,
    preference: number,
  ): Promise<Interview> {
    try {
      if (!preference || preference < 1)
        throw new BadRequestException('student_preference must be ≥ 1');

      const interview = await this.findOne(id);
      if (!interview)
        throw new NotFoundException(`Interview with ID ${id} not found`);

      interview.student_preference = preference;
      return this.interviewRepository.save(interview);
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Failed to set student preference: ${err.message}`,
      );
    }
  }

  async clearWalkinsFromStall(
    stallID: string,
  ): Promise<{ updated: number }> {
    try {
      const list = await this.interviewRepository.find({
        where: { stallID, type: InterviewType.WALK_IN },
      });

      if (list.length === 0) return { updated: 0 };

      list.forEach((iv) => {
        iv.stallID = null;
        iv.status = InterviewStatus.SCHEDULED;
      });

      await this.interviewRepository.save(list);
      return { updated: list.length };
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to clear walk-ins from stall: ${err.message}`,
      );
    }
  }
}