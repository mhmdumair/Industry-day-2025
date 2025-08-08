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
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Student } from '../student/entities/student.entity';
import { Stall } from '../stall/entities/stall.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Stall)
    private stallRepository: Repository<Stall>,
  ) {}


  private async renumberPreferences(companyID: string): Promise<void> {
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
  }

  /** Next preference = max + 1 (after any previous renumber) */
  private async nextCompanyPreference(companyID: string): Promise<number> {
  const row = await this.interviewRepository
    .createQueryBuilder('i')
    .select('MAX(i.company_preference)', 'max')
    .where('i.companyID = :companyID', { companyID })
    .andWhere('i.type = :type', { type: InterviewType.PRE_LISTED })
    .getRawOne<{ max: string | null }>();     // row may be undefined

  const maxPref = row?.max ? Number(row.max) : 0; // safe-guard
  return maxPref + 1;
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

  async createPrelist(dto: CreateInterviewDto): Promise<Interview> {
    try {
      const interview = this.interviewRepository.create({
        ...dto,
        type: InterviewType.PRE_LISTED,
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

  async createWalkin(dto: CreateInterviewDto): Promise<Interview> {
    try {
      const interview = this.interviewRepository.create({
        ...dto,
        type: InterviewType.WALK_IN,
        stallID: undefined,
        status: InterviewStatus.INQUEUE,
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
    
    // Ensure preferences are contiguous before starting
    await Promise.all(companyIDs.map(id => this.renumberPreferences(id)));
    
    await Promise.all(
      companyIDs.map(async id => {
        prefs[id] = await this.nextCompanyPreference(id) - 1;
      }),
    );

    for (let i = 0; i < dtos.length; i++) {
      try {
        const dto = dtos[i];
        prefs[dto.companyID] += 1;

        const interview = this.interviewRepository.create({
          ...dto,
          type: InterviewType.PRE_LISTED,
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


  async findAll() {
    return this.interviewRepository.find({
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.interviewRepository.findOne({
      where: { interviewID: id },
      relations: ['stall', 'student', 'student.user'],
    });
  }

  async findByStudentId(studentID: string) {
    return this.interviewRepository.find({
      where: { studentID },
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByStallId(stallID: string) {
    return this.interviewRepository.find({
      where: { stallID },
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByCompanyId(companyID: string) {
    return this.interviewRepository.find({
      where: { companyID },
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'DESC' },
    });
  }

  /* ----------  PRE-LIST QUERIES  ---------- */

  private prelistOrder = {
    company_preference: 'ASC' as const,
    student_preference: 'ASC' as const,
  };

  getPrelistedByCompany(companyID: string) {
    return this.interviewRepository.find({
      where: { companyID, type: InterviewType.PRE_LISTED },
      relations: ['stall', 'student', 'student.user'],
      order: this.prelistOrder,
    });
  }

  getPrelistedScheduledByCompany(companyID: string) {
    return this.interviewRepository.find({
      where: {
        companyID,
        type: InterviewType.PRE_LISTED,
        status: InterviewStatus.SCHEDULED,
      },
      relations: ['stall', 'student', 'student.user'],
      order: this.prelistOrder,
    });
  }

  /* ----------  WALK-IN QUERIES  ---------- */

  getWalkinByCompany(companyID: string) {
    return this.interviewRepository.find({
      where: { companyID, type: InterviewType.WALK_IN },
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'ASC' },
    });
  }

  getWalkinScheduledByCompany(companyID: string) {
    return this.interviewRepository.find({
      where: {
        companyID,
        type: InterviewType.WALK_IN,
        status: InterviewStatus.SCHEDULED,
      },
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'ASC' },
    });
  }

  async getWalkinCountByCompany(companyID: string) {
    const count = await this.interviewRepository.count({
      where: { companyID, type: InterviewType.WALK_IN },
    });
    return { count };
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
          status: InterviewStatus.INQUEUE,
        })
        .andWhere('interview.stallID IS NULL');

      // Priority column: 0 if student.group contains stream
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

      return await qb.getMany();
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to get next walk-in interviews: ${err.message}`,
      );
    }
  }

  getPrelistedSortedByStudent(studentID: string) {
    return this.interviewRepository.find({
      where: { studentID, type: InterviewType.PRE_LISTED },
      relations: ['stall', 'student', 'student.user'],
      order: this.prelistOrder,
    });
  }

  getWalkinSortedByStudent(studentID: string) {
    return this.interviewRepository.find({
      where: { studentID, type: InterviewType.WALK_IN },
      relations: ['stall', 'student', 'student.user'],
      order: { created_at: 'ASC' },
    });
  }

  /* ------------------------------------------------------------------ */
  /*  UPDATE / STATUS / CANCEL                                          */
  /* ------------------------------------------------------------------ */

  async update(id: string, dto: UpdateInterviewDto) {
    const interview = await this.findOne(id);
    if (!interview)
      throw new NotFoundException(`Interview with ID ${id} not found`);

    this.interviewRepository.merge(interview, dto);
    return this.interviewRepository.save(interview);
  }

  async updateStatus(id: string, status: InterviewStatus) {
    const interview = await this.findOne(id);
    if (!interview)
      throw new NotFoundException(`Interview with ID ${id} not found`);

    interview.status = status;
    return this.interviewRepository.save(interview);
  }

  scheduleInterview(id: string) {
    return this.updateStatus(id, InterviewStatus.SCHEDULED);
  }

  completeInterview(id: string, remark?: string) {
    return this.update(id, { status: InterviewStatus.COMPLETED, remark });
  }

  cancelInterview(id: string) {
    return this.updateStatus(id, InterviewStatus.CANCELLED);
  }

  /* ------------------------------------------------------------------ */
  /*  REMOVE                                                            */
  /* ------------------------------------------------------------------ */

  async remove(id: string) {
    const interview = await this.findOne(id);
    if (!interview)
      throw new NotFoundException(`Interview with ID ${id} not found`);

    await this.interviewRepository.remove(interview);
    return { message: `Interview ${id} removed successfully` };
  }

  async removePrelistedInterview(id: string) {
    const interview = await this.interviewRepository.findOne({
      where: { interviewID: id, type: InterviewType.PRE_LISTED },
    });
    if (!interview)
      throw new NotFoundException(
        `Pre-listed interview with ID ${id} not found`,
      );

    const companyID = interview.companyID;
    await this.interviewRepository.remove(interview);
    
    // Renumber preferences to keep them contiguous
    await this.renumberPreferences(companyID);
    
    return { message: `Pre-listed interview ${id} removed successfully` };
  }

  /* ------------------------------------------------------------------ */
  /*  STUDENT PREFERENCE                                                */
  /* ------------------------------------------------------------------ */

  async setStudentPreference(
    id: string,
    preference: number,
  ): Promise<Interview> {
    if (!preference || preference < 1)
      throw new BadRequestException('student_preference must be ≥ 1');

    const interview = await this.findOne(id);
    if (!interview)
      throw new NotFoundException(`Interview with ID ${id} not found`);

    interview.student_preference = preference;
    return this.interviewRepository.save(interview);
  }
}
