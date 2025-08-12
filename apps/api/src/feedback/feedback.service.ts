import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UserRole } from '../user/entities/user.entity'; // Import UserRole enum

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { feedbackID: id },
      relations: ['user'],
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
    return feedback;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.findOne(id);
    this.feedbackRepository.merge(feedback, updateFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedbackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
  }

  async findStudentFeedback(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['user'],
      where: { user: { role: UserRole.STUDENT } }, 
    });
  }

  async findCompanyFeedback(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['user'],
      where: { user: { role: UserRole.COMPANY } }, 
    });
  }
}