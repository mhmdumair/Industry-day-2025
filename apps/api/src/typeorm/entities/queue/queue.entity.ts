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
import { QueueEntry } from '../queue/queue-entry.entity';

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

  @OneToMany(() => QueueEntry, (entry) => entry.queue)
  queueEntries: QueueEntry[];
}
