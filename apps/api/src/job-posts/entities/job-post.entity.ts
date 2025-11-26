import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Company } from '../../company/entities/company.entity';

@Entity('job_posts')
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  jobPostID: string;

  @Column()
  companyID: string;

  @Column()
  fileName: string;

  @ManyToOne(() => Company, (company) => company.jobPosts, { nullable: false })
  @JoinColumn({ name: 'companyID' })
  company: Company;
}