import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  Interview,
  InterviewStatus,
  InterviewType,
} from '../typeorm/entities/student/interview.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
  ) {}

  // Get the ordered queue for a stall
  async getOrderedQueue(stallID: string): Promise<Interview[]> {
    const allInterviews = await this.interviewRepository.find({
      where: { stallID, status: InterviewStatus.SCHEDULED },
    });

    const prelisted1 = allInterviews.filter((i) => i.priority.endsWith('_1'));
    const prelisted2 = allInterviews.filter((i) => i.priority.endsWith('_2'));
    const prelisted3 = allInterviews.filter((i) => i.priority.endsWith('_3'));
    const walkins = allInterviews.filter(
      (i) => i.category === InterviewType.WALK_IN,
    );

    // Sort each group by position
    prelisted1.sort((a, b) => a.position - b.position);
    prelisted2.sort((a, b) => a.position - b.position);
    prelisted3.sort((a, b) => a.position - b.position);
    walkins.sort((a, b) => a.position - b.position);

    // Combine in order: prelisted1, prelisted2, prelisted3, walkins
    return [...prelisted1, ...prelisted2, ...prelisted3, ...walkins];
  }

  // Add a prelisted student interview to the queue
  async addPrelistedInterview(
    stallID: string,
    studentID: string,
    companyCode: string,
    priorityLevel: number,
    cvID: string,
    queueID: string,
    scheduledTime: Date,
    category: InterviewType,
  ): Promise<Interview> {
    // Enforce buffer: must complete previous priority before joining next
    if (priorityLevel > 1) {
      const prevPriority = priorityLevel - 1;
      const hasCompletedPrev = await this.interviewRepository.findOne({
        where: {
          studentID,
          stallID,
          priority: Like(`%_${prevPriority}`),
          status: InterviewStatus.COMPLETED,
        },
      });
      if (!hasCompletedPrev) {
        throw new Error(
          `Must complete priority ${prevPriority} interview before joining priority ${priorityLevel}`,
        );
      }
    }

    // Determine next position in the queue for this stall
    const maxPosition = await this.interviewRepository
      .createQueryBuilder('interview')
      .select('MAX(interview.position)', 'max')
      .where('interview.stallID = :stallID', { stallID })
      .getRawOne();

    const nextPosition = (maxPosition?.max ?? 0) + 1;

    const interview = this.interviewRepository.create({
      stallID,
      studentID,
      cvID,
      queueID,
      priority: `${studentID}_${companyCode}_${priorityLevel}`,
      category,
      status: InterviewStatus.SCHEDULED,
      position: nextPosition,
      scheduledTime,
    });

    return this.interviewRepository.save(interview);
  }

  // Add a walk-in student interview to the queue
  async addWalkinInterview(
    stallID: string,
    studentID: string,
    companyCode: string,
    cvID: string,
    queueID: string,
    scheduledTime: Date,
    category: InterviewType,
  ): Promise<Interview> {
    // Determine next position in the queue for this stall
    const maxPosition: number = await this.interviewRepository
      .createQueryBuilder('interview')
      .select('MAX(interview.position)', 'max')
      .where('interview.stallID = :stallID', { stallID })
      .getRawOne();

    const nextPosition = (maxPosition?.max ?? 0) + 1;

    const interview = this.interviewRepository.create({
      stallID,
      studentID,
      cvID,
      queueID,
      priority: `${studentID}_${companyCode}_walkin`,
      category,
      status: InterviewStatus.SCHEDULED,
      position: nextPosition,
      scheduledTime,
    });

    return this.interviewRepository.save(interview);
  }

  // Mark an interview as completed
  async completeInterview(interviewID: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { interviewID },
    });
    if (!interview) {
      throw new Error('Interview not found');
    }
    interview.status = InterviewStatus.COMPLETED;
    return this.interviewRepository.save(interview);
  }
}
