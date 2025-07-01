import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { RoomAdmin } from '../user/room-admin.entity';
import { Stall } from './stall.entity';

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

  @Column({ default: false })
  isActive: boolean;

  // Relationships
  @OneToOne(() => RoomAdmin, (roomAdmin) => roomAdmin.room, { nullable: false })
  roomAdmin: RoomAdmin;

  @OneToMany(() => Stall, (stalls) => stalls.room, { nullable: true })
  stalls: Stall[];
}
