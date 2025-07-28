import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { Company } from '../company/company.entity';
import { Interview } from '../student/interview.entity';

export enum StallStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
  PAUSED = 'paused',
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

  // Relationships
  @ManyToOne(() => Room, (room) => room.stalls, { nullable: false })
  @JoinColumn({ name: 'roomID' })
  room: Room;

  @ManyToOne(() => Company, (company) => company.stalls)
  @JoinColumn({ name: 'companyID' })
  company: Company;

  @OneToMany(() => Interview, (interview) => interview.stall)
  interviews: Interview[];

}
