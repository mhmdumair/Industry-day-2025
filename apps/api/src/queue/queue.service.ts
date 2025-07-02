import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Interview,
  InterviewStatus,
  InterviewType,
} from '../typeorm/entities/student/interview.entity';
import { Queue } from '../typeorm/entities/queue/queue.entity';
import { Stall } from '../typeorm/entities/facility/stall.entity';

export interface AddToQueueDto {
  studentID: string;
  stallID: string;
  cvID: string;
  priority: string;
  type: InterviewType;
  scheduledTime: string;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    @InjectRepository(Stall)
    private stallRepository: Repository<Stall>,
  ) {}

  private parsePriority(priority: string): {
    studentId: string;
    companyId: string;
    priorityNum: number | 'buffer' | 'walkin';
  } {
    const parts = priority.split('_');
    if (parts.length !== 3) throw new Error('Invalid priority format');
    const [studentId, companyId, priorityPart] = parts;
    let priorityNum: number | 'buffer' | 'walkin';
    if (priorityPart === 'buffer') priorityNum = 'buffer';
    else if (priorityPart === 'walkin') priorityNum = 'walkin';
    else priorityNum = parseInt(priorityPart, 10);
    return { studentId, companyId, priorityNum };
  }

  async addInterviewToQueue(dto: AddToQueueDto): Promise<void> {
    const { studentID, stallID, cvID, priority, type, scheduledTime } = dto;

    // Validate stall and queue
    const stall = await this.stallRepository.findOne({
      where: { stallID },
      relations: ['queue'],
    });
    if (!stall) throw new Error('Stall not found');
    if (!stall.queue) throw new Error('Queue not found for stall');

    const queue = stall.queue;

    // Fetch all interviews in this queue ordered by position
    const interviews = await this.interviewRepository.find({
      where: { queueID: queue.queueID },
      order: { position: 'ASC' },
    });

    // Parse priority
    const { priorityNum } = this.parsePriority(priority);

    // Create new interview entity
    const newInterview = this.interviewRepository.create({
      studentID,
      stallID,
      cvID,
      queueID: queue.queueID,
      priority,
      type,
      status: InterviewStatus.SCHEDULED,
      scheduledTime: new Date(scheduledTime),
      position: 0, // will be set later
    });

    // Determine insertion position
    // Priority order: 1 (front), 2 (after 1), 3 (after 2), buffer (null nodes), walkin (end)
    const priorityOrder = (p: number | 'buffer' | 'walkin') =>
      p === 1 ? 1 : p === 2 ? 2 : p === 3 ? 3 : p === 'buffer' ? 4 : 5;

    const newPriorityOrder = priorityOrder(priorityNum);

    // Find insertion index
    let insertIndex = interviews.findIndex((interview) => {
      const p = this.parsePriority(interview.priority).priorityNum;
      return priorityOrder(p) > newPriorityOrder;
    });

    if (insertIndex === -1) insertIndex = interviews.length; // insert at end

    // Insert new interview at insertIndex
    interviews.splice(insertIndex, 0, newInterview);

    // Insert null nodes for buffer after priority 1 interviews if not already present
    const countPriority1 = interviews.filter(
      (i) => i && this.parsePriority(i.priority).priorityNum === 1,
    ).length;
    const bufferIndex = interviews.findIndex((i) => i === null);
    if (bufferIndex === -1 && countPriority1 > 0) {
      // Insert buffer null nodes after priority 1
      for (let i = 0; i < countPriority1; i++) {
        // @ts-ignore
        interviews.splice(countPriority1 + i, 0, null);
      }
    }

    // Reassign positions
    let positionCounter = 1;
    for (let i = 0; i < interviews.length; i++) {
      if (interviews[i] !== null) {
        interviews[i].position = positionCounter++;
      }
    }

    // Save all interviews (excluding nulls)
    for (const interview of interviews) {
      if (interview !== null) {
        await this.interviewRepository.save(interview);
      }
    }
  }

  async getQueueByStallID(stallID: string): Promise<(Interview | null)[]> {
    const stall = await this.stallRepository.findOne({
      where: { stallID },
      relations: ['queue'],
    });
    if (!stall) throw new Error('Stall not found');
    if (!stall.queue) throw new Error('Queue not found for stall');

    const queue = stall.queue;

    // Fetch all interviews ordered by position
    const interviews = await this.interviewRepository.find({
      where: { queueID: queue.queueID },
      order: { position: 'ASC' },
    });

    // Insert null nodes for buffer after priority 1 interviews
    const result: (Interview | null)[] = [];
    let countPriority1 = 0;
    for (const interview of interviews) {
      const p = this.parsePriority(interview.priority).priorityNum;
      result.push(interview);
      if (p === 1) countPriority1++;
    }

    // Insert null buffer nodes after priority 1 interviews
    for (let i = 0; i < countPriority1; i++) {
      result.splice(countPriority1 + i, 0, null);
    }

    return result;
  }

  async resetAllQueues(): Promise<void> {
    await this.interviewRepository.clear();
  }
}
