import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stall } from '../facility/stall.entity';
import { Student } from '../user/student.entity';

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

  @Column({ type: 'enum', enum: InterviewType })
  type: InterviewType;

  @Column({ type: 'enum', enum: InterviewStatus })
  status: InterviewStatus;

  @Column('text', { nullable: true })
  remark?: string;

  // Relationships

  @ManyToOne(() => Stall, (stall) => stall.interviews, { nullable: false })
  @JoinColumn({ name: 'stallID' })
  stall: Stall;

  @ManyToOne(() => Student, (student) => student.interviews, { nullable: false })
  @JoinColumn({ name: 'studentID' })
  student: Student;
}
