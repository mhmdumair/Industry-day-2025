import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { StudentCv } from './student-cv.entity';
import { Interview } from '../facility/interview.entity';
import { QueueEntry } from '../queue/queue-entry.entity';
import { CompanyShortlist } from '../company/company-shortlist.entity';

export enum StudentGroup {
  GROUP_A = 'group_a',
  GROUP_B = 'group_b',
  GROUP_C = 'group_c',
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

  @OneToMany(() => QueueEntry, (queueStudent) => queueStudent.student, {
    nullable: true,
  })
  queueEntries: QueueEntry[] | null;
}
