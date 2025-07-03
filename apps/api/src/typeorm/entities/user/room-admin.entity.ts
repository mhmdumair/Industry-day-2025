import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Room } from '../facility/room.entity';

@Entity('room_admins')
export class RoomAdmin {
  @PrimaryGeneratedColumn('uuid')
  roomAdminID: string;

  @Column()
  userID: string;

  @Column()
  designation: string;

  @Column()
  roomID: string;

  // Relationships
  @OneToOne(() => User, (user) => user.roomAdmin, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User;

  @OneToOne(() => Room, (room) => room.roomAdmin, { nullable: true })
  @JoinColumn({ name: 'roomID' })
  room: Room;
}
