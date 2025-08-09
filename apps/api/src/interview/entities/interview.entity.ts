import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { Stall } from '../../stall/entities/stall.entity';
import { Student } from '../../student/entities/student.entity';

export enum InterviewType {
  PRE_LISTED = 'pre-listed',
  WALK_IN = 'walk-in',
}


export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  INQUEUE = "in_queue"
}

@Unique(['companyID', 'studentID'])
@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  interviewID: string;

  @Column({ type: 'uuid', nullable: true })
  stallID: string | null;

  @Column()
  companyID :string

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
