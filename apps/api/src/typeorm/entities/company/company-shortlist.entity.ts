import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('company_shortlists')
export class CompanyShortlist {
  @PrimaryGeneratedColumn('uuid')
  shortlistID: string;

  @Column()
  companyID: string;

  @Column()
  studentID: string;

  // Relationships
  @ManyToOne(() => Company, (company) => company.shortlists, { nullable: true })
  @JoinColumn({ name: 'companyID' })
  company: Company | null;
}
