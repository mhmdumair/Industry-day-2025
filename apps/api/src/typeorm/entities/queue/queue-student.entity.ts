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

export enum QueueStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LEFT = 'left',
}

@Entity('queue_students')
export class QueueStudent {
  @PrimaryGeneratedColumn('uuid')
  queueStudentID: string;

  @Column()
  queueID: string;

  @Column()
  studentID: string;

  @Column('int')
  position: number;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ type: 'enum', enum: QueueStatus })
  status: QueueStatus;

  // Relationships
  @ManyToOne(() => Queue, (queue) => queue.students)
  @JoinColumn({ name: 'queueID' })
  queue: Queue;

  @ManyToOne(() => Student, (student) => student.queueEntries)
  @JoinColumn({ name: 'studentID' })
  student: Student;
}
