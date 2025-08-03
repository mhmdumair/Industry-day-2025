import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyShortlist } from '../../shortlist/entities/company-shortlist.entity';
import { Stall } from '../../stall/entities/stall.entity';
import { User } from '../../user/entities/user.entity';

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
export enum CompanySponsership {
  MAIN = 'MAIN',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  BRONZE = 'BRONZE'
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

  @Column({ type: 'enum', enum: CompanySponsership })
  sponsership: CompanySponsership;

  @Column()
  location: string;

  @Column()
  companyWebsite: string;

  @OneToOne(() => User, (user) => user.company, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User | null;

  @OneToOne(() => CompanyShortlist, (shortlist) => shortlist.company, {
    nullable: true,
  })
  shortlist: CompanyShortlist | null;



  @OneToMany(() => Stall, (stalls) => stalls.room, { nullable: true })
  stalls: Stall[];
}



