import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum AudienceType {
  ALL = 'ALL',
  STUDENTS = 'STUDENTS',
  COMPANIES = 'COMPANIES',
}

@Entity('announcement')
export class Announcement {
  @PrimaryColumn()
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'postedByUserID' })
  postedByUser: User;

}
