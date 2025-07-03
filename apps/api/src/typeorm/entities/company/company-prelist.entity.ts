import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('company_prelists')
export class CompanyPrelist {
  @PrimaryGeneratedColumn('uuid')
  prelistID: string;

  @Column()
  companyID: string;

  @Column()
  studentID: string;

  // Relationships
  @ManyToOne(() => Company, (company) => company.prelist, { nullable: true })
  @JoinColumn({ name: 'companyID' })
  company: Company | null;
}
