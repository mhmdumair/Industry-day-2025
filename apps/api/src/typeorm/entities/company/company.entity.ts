import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyShortlist } from './company-shortlist.entity';
import { Stall } from '../facility/stall.entity';
import { User } from '../user/user.entity';
import { CompanyPrelist } from './company-prelist.entity';

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
  userID: string;

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

  // Relationships

  @OneToOne(() => User, (user) => user.company, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User | null;

  @OneToOne(() => CompanyShortlist, (shortlist) => shortlist.company, {
    nullable: true,
  })
  shortlist: CompanyShortlist | null;

  @OneToOne(() => CompanyPrelist, (prelist) => prelist.company, {
    nullable: true,
  })
  prelist: CompanyPrelist | null;

  @OneToMany(() => Stall, (stalls) => stalls.room, { nullable: true })
  stalls: Stall[];
}
