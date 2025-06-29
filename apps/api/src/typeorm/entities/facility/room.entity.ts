import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RoomAdmin } from '../user/room-admin.entity';
import { Stall } from '../facility/stall.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  roomID: string;

  @Column()
  roomName: string;

  @Column()
  location: string;

  @Column()
  roomAdminID: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @OneToOne(() => RoomAdmin, (roomAdmin) => roomAdmin.room, { nullable: false })
  @JoinColumn({ name: 'roomAdminID' })
  roomAdmin: RoomAdmin;

  @OneToMany(() => Stall, (stalls) => stalls.room, { nullable: true })
  stalls: Stall[];
}
