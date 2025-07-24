import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum AudienceType {
  ALL = 'ALL',
  STUDENTS = 'STUDENTS',
  COMPANIES = 'COMPANIES',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid') 
  announcementID: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: AudienceType,
  })
  audienceType: AudienceType;

  @Column()
  postedByUserID: string;

  @ManyToOne(() => User, (user) => user.announcements)
  @JoinColumn({ name: 'postedByUserID' })
  postedByUser: User;
}
