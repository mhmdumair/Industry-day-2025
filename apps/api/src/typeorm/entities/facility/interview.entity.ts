import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stall } from './stall.entity';
import { Student } from '../student/student.entity';
import { StudentCv } from '../student/student-cv.entity';

export enum InterviewCategory {
  TECHNICAL = 'technical',
  HR = 'hr',
  FINAL = 'final',
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

  @Column({ type: 'enum', enum: InterviewCategory })
  category: InterviewCategory;

  @Column({ type: 'enum', enum: InterviewStatus })
  status: InterviewStatus;

  @Column('text', { nullable: true })
  remark: string;

  @Column({ type: 'timestamp' })
  scheduledTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualTime: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

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
