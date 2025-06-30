import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Queue } from './queue.entity';
import { Student } from '../student/student.entity';

export enum QueueStudentType {
  PRELISTED = 'prelisted',
  WALKIN = 'walkin',
}

export enum QueuePriority {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  BUFFER = 99,
}

export enum QueueStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LEFT = 'left',
}

@Entity('queue_entries')
export class QueueEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  queueID: string;

  @Column()
  studentID: string;

  @Column('int')
  position: number;

  @Column({ type: 'enum', enum: QueueStudentType })
  studentType: QueueStudentType;

  @Column({ type: 'int', nullable: true })
  priority: number; // 1, 2, 3, 99 for buffer, null for walk-in

  @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.WAITING })
  status: QueueStatus;

  @CreateDateColumn()
  joinedAt: Date;

  // Relationships
  @ManyToOne(() => Queue, (queue) => queue.queueEntries)
  @JoinColumn({ name: 'queueID' })
  queue: Queue;

  @ManyToOne(() => Student, (student) => student.queueEntries)
  @JoinColumn({ name: 'studentID' })
  student: Student;
}
