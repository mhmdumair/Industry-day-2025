import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  adminID: string;

  @Column()
  userID: string;

  @Column()
  designation: string;

  // Relationships
  @OneToOne(() => User, (user) => user.admin, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User | null;
}
