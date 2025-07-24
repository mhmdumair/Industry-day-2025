import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Announcements } from './announcement.entity';
import { Company } from '../company/company.entity';

@Entity('company_announcement')
export class CompanyAnnouncement {
  @PrimaryColumn()
  companyAnnouncementID: string;

  @Column()
  announcementID: string;

  @Column()
  companyID: string;

  // Relationships
  @ManyToOne(() => Announcements)
  @JoinColumn({ name: 'announcementID' })
  announcement: Announcements;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyID' })
  company: Company;
}
