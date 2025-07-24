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
import { QueueAnnouncement } from './queue-announcement.entity';
import { CompanyAnnouncement } from './company-announcement.entity';

// Enum for audience type
export enum AudienceType {
  ALL = 'ALL',
  STUDENTS = 'STUDENTS',
  COMPANIES = 'COMPANIES',
  QUEUES = 'QUEUES',
}

@Entity('announcements')
export class Announcements {
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

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: 'postedByUserID' })
  postedByUser: User;

  @OneToMany(
    () => QueueAnnouncement,
    (queueAnnouncement) => queueAnnouncement.announcement,
  )
  queueAnnouncements: QueueAnnouncement[];

  @OneToMany(
    () => CompanyAnnouncement,
    (companyAnnouncement) => companyAnnouncement.announcement,
  )
  companyAnnouncements: CompanyAnnouncement[];
}
