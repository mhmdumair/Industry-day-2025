import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne, 
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedbackID: string;

  @Column()
  comment: string;

  @Column({ type: 'int' })
  rating: number; 

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User) 
  @JoinColumn({ name: 'userID' })
  user: User;

  @Column()
  userID: string;
}