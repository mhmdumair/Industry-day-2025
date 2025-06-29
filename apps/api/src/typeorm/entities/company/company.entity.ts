import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CompanyShortlist } from './company-shortlist.entity';
import { Stall } from '../facility/stall.entity';

export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum CompanyStream {
  IT = 'it',
  ENGINEERING = 'engineering',
  BUSINESS = 'business',
  FINANCE = 'finance',
}

export enum CompanyLocation {
  COLOMBO = 'colombo',
  KANDY = 'kandy',
  GALLE = 'galle',
  JAFFNA = 'jaffna',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  companyID: string;

  @Column()
  companyName: string;

  @Column('text')
  description: string;

  @Column()
  contactPersonName: string;

  @Column()
  contactPersonDesignation: string;

  @Column()
  contactNumber: string;

  @Column({ type: 'enum', enum: CompanyStatus })
  status: CompanyStatus;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'enum', enum: CompanyStream })
  stream: CompanyStream;

  @Column({ type: 'enum', enum: CompanyLocation })
  location: CompanyLocation;

  @Column()
  companyWebsite: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => CompanyShortlist, (shortlist) => shortlist.company, { nullable: true })
  shortlists: CompanyShortlist[] | null;

  @OneToMany(() => Stall, (stalls) => stalls.room, { nullable: true })
  stalls: Stall[];
}
