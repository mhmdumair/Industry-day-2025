import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { Company } from '../company/company.entity';
import { Interview } from './interview.entity';
import { Queue } from '../queue/queue.entity';

export enum StallStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('stalls')
export class Stall {
  @PrimaryGeneratedColumn('uuid')
  stallID: string;

  @Column()
  roomID: string;

  @Column()
  companyID: string;

  @Column({ type: 'enum', enum: StallStatus })
  status: StallStatus;

  @Column()
  stallNumber: string;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Room, (room) => room.stalls, { nullable: false })
  @JoinColumn({ name: 'roomID' })
  room: Room;

  @ManyToOne(() => Company, (company) => company.stalls)
  @JoinColumn({ name: 'companyID' })
  company: Company;

  @OneToMany(() => Interview, (interview) => interview.stall)
  interviews: Interview[];

  @OneToOne(() => Queue, (queue) => queue.stall)
  queue: Queue;
}
