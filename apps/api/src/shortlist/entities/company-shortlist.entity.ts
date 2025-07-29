import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Student } from '../../student/entities/student.entity';

@Entity('company_shortlists')
export class CompanyShortlist {
  @PrimaryGeneratedColumn('uuid')
  shortlistID: string;

  @Column()
  companyID: string;

  @Column()
  studentID: string;

  @Column()
  description : string;

  // Relationships
  @ManyToOne(() => Company, (company) => company.shortlist, { nullable: true })
  @JoinColumn({ name: 'companyID' })
  company: Company | null;

  @ManyToOne(() => Student, (student) => student.shortlist, { nullable: true })
  @JoinColumn({ name: 'studentID' })
  student: Student | null;
}
