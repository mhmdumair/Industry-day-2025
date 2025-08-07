import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../room/entities/room.entity';

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

  @OneToOne(() => User, (user) => user.roomAdmin, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User;

  @OneToOne(() => Room, (room) => room.roomAdmin, { nullable: true })
  @JoinColumn({ name: 'roomID' })
  room: Room;
}
