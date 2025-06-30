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

export enum CompanyStream {
  ZL = 'ZL',
  BT = 'BT',
  CH = 'CH',
  MT = 'MT',
  BMS = 'BMS',
  ST = 'ST',
  GL = 'GL',
  CS = 'CS',
  DS = 'DS',
  ML = 'ML',
  BL = 'BL',
  MB = 'MB',
  CM = 'CM',
  AS = 'AS',
  ES = 'ES',
  SOR = 'SOR',
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

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'enum', enum: CompanyStream })
  stream: CompanyStream;

  @Column()
  location: string;

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
