import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stall } from './stall.entity';
import { Student } from '../student/student.entity';
import { StudentCv } from '../student/student-cv.entity';

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
  priority: string; //studentID_companyId_priority (e.g., "stu123_COMP1_1")

  @Column({ type: 'enum', enum: InterviewType })
  category: InterviewType;

  @Column({ type: 'enum', enum: InterviewStatus })
  status: InterviewStatus;

  @Column('text', { nullable: true })
  remark: string;

  @Column({ type: 'timestamp' })
  scheduledTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualTime: Date;

  // Relationships
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
