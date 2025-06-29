import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Stall } from '../facility/stall.entity';
import { QueueStudent } from './queue-student.entity';

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  queueID: string;

  @Column()
  stallID: string;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @OneToOne(() => Stall, (stall) => stall.queue, { nullable: true })
  @JoinColumn({ name: 'stallID' })
  stall: Stall | null;

  @OneToMany(() => QueueStudent, (queueStudent) => queueStudent.queue)
  students: QueueStudent[];
}
