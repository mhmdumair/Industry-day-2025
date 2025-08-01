import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StudentCv } from '../../cv/entities/student-cv.entity';
import { Interview } from '../../interview/entities/interview.entity';
import { CompanyPrelist } from '../../pre-list/entities/company-prelist.entity';
import { CompanyShortlist } from '../../shortlist/entities/company-shortlist.entity';

export enum StudentGroup {
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

export enum StudentLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  studentID: string;

  @Column()
  userID: string;

  @Column({ unique: true })
  regNo: string;

  @Column({ unique: true })
  nic: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column()
  contact: string;

  @Column({ type: 'enum', enum: StudentGroup })
  group: StudentGroup;

  @Column({ type: 'enum', enum: StudentLevel })
  level: StudentLevel;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.student, { nullable: true })
  @JoinColumn({ name: 'userID' })
  user: User | null;

  @OneToMany(() => StudentCv, (cv) => cv.student, { nullable: true })
  cvs: StudentCv[] | null;

  @OneToMany(() => Interview, (interview) => interview.student, {
    nullable: true,
  })
  interviews: Interview[] | null;

  @OneToMany(() => CompanyPrelist, (prelist) => prelist.student, {
    nullable: true,
  })
  prelists: CompanyPrelist[] | null;

  @OneToMany(() => CompanyShortlist, (shortlist) => shortlist.student, {
    nullable: true,
  })
  shortlist: CompanyShortlist[] | null;


  
}
