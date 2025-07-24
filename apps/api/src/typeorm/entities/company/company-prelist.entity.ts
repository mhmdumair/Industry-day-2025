import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Student } from '../user/student.entity';

@Entity('company_prelists')
export class CompanyPrelist {
  @PrimaryGeneratedColumn('uuid')
  prelistID: string;

  @Column()
  companyID: string;

  @Column()
  studentID: string;

  // Relationships
  @ManyToOne(() => Company, (company) => company.prelists, { nullable: true })
  @JoinColumn({ name: 'companyID' })
  company: Company | null;

  @ManyToOne(() => Student, (student) => student.prelists, { nullable: true })
  @JoinColumn({ name: 'studentID' })
  student: Student | null;
}
