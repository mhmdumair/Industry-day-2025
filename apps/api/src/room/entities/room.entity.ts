import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { RoomAdmin } from '../../room-admin/entities/room-admin.entity';
import { Stall } from '../../stall/entities/stall.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  roomID: string;

  @Column()
  roomName: string;

  @Column()
  location: string;

  @Column({ default: false })
  isActive: boolean;

  // Relationships
  @OneToOne(() => RoomAdmin, (roomAdmin) => roomAdmin.room, { nullable: false })
  roomAdmin: RoomAdmin;

  @OneToMany(() => Stall, (stalls) => stalls.room, { nullable: true })
  stalls: Stall[];
}
