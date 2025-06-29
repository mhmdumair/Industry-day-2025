import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Interview } from '../facility/interview.entity';

@Entity('student_cvs')
export class StudentCv {
  @PrimaryGeneratedColumn('uuid')
  cvID: string;

  @Column()
  studentID: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @CreateDateColumn()
  uploadDate: Date;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Student, (student) => student.cvs, { nullable: true })
  @JoinColumn({ name: 'studentID' })
  student: Student;

  @OneToMany(() => Interview, (interview) => interview.cv, { nullable: true })
  interviews: Interview[] | null;
}
