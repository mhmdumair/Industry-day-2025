import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn, // <-- import this
} from 'typeorm';
import { Stall } from '../../stall/entities/stall.entity';
import { Student } from '../../student/entities/student.entity';

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

@Unique(['stallID', 'studentID'])
@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  interviewID: string;

  @Column()
  stallID: string;

  @Column()
  studentID: string;

  @Column({ type: 'enum', enum: InterviewType })
  type: InterviewType;

  @Column({ type: 'enum', enum: InterviewStatus })
  status: InterviewStatus;

  @Column('text', { nullable: true })
  remark?: string;

  @Column({ type: 'int', nullable: false, default: 999 })    
  student_preference: number;

  @Column({ type: 'int', nullable: false, default: 999 })
  company_preference: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;


  @ManyToOne(() => Stall, (stall) => stall.interviews, { nullable: false })
  @JoinColumn({ name: 'stallID' })
  stall: Stall;

  @ManyToOne(() => Student, (student) => student.interviews, { nullable: false })
  @JoinColumn({ name: 'studentID' })
  student: Student;
}
