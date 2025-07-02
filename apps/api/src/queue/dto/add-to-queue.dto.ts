import { InterviewType } from '../../typeorm/entities/student/interview.entity';

export class AddToQueueDto {
  studentID: string;
  stallID: string;
  cvID: string;
  priority: string;
  type: InterviewType;
  scheduledTime: string;
}
