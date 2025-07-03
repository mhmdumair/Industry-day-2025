import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, Timestamp,
} from 'typeorm';
import { Stall } from '../facility/stall.entity';
import { Student } from '../user/student.entity';
import { StudentCv } from './student-cv.entity';
import {Queue} from "../queue/queue.entity";

export enum InterviewType {
  PRE_LISTED = 'pre-listed',
  WALK_IN = 'walk-in',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  interviewID: string;

  @Column()
  stallID: string;

  @Column()
  studentID: string;

  @Column()
  cvID: string;

  @Column()
  queueID: string;

  @Column()
  priority: string; //studentID_companyId_priority (e.g., "s20381_OCT_1")

  @Column({ type: 'enum', enum: InterviewType })
  type: InterviewType;

  @Column({ type: 'enum', enum: InterviewStatus })
  status: InterviewStatus;

  @Column('text', { nullable: true })
  remark: string;

  @Column({ type: 'timestamp' })
  scheduledTime: Timestamp;

  @Column({ type: 'timestamp', nullable: true })
  actualTime: Timestamp;

  // Relationships
  @ManyToOne(() => Queue, (queue) => queue.interview, { nullable: true })
  @JoinColumn({ name: 'queueID' })
  queue: Queue;

  @ManyToOne(() => Stall, (stall) => stall.interviews, { nullable: true })
  @JoinColumn({ name: 'stallID' })
  stall: Stall;

  @ManyToOne(() => Student, (student) => student.interviews, { nullable: true })
  @JoinColumn({ name: 'studentID' })
  student: Student;

  @ManyToOne(() => StudentCv, (cv) => cv.interviews, { nullable: true })
  @JoinColumn({ name: 'cvID' })
  cv: StudentCv | null;
}
