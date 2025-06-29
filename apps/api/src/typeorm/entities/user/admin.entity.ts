import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  adminID: string;

  @Column()
  userID: string;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.admin, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User | null;
}
