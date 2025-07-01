import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Stall } from '../facility/stall.entity';
import { Interview } from '../student/interview.entity';

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  queueID: string;

  @Column()
  stallID: string;

  // Relationships
  @OneToOne(() => Stall, (stall) => stall.queue, { nullable: true })
  @JoinColumn({ name: 'stallID' })
  stall: Stall | null;

  @ManyToOne(() => Interview, (interview) => interview.queue, {
    nullable: true,
  })
  @JoinColumn({ name: 'interviewID' })
  interview: Interview | null;
}
