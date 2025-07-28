import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Student } from '../user/student.entity';
import { Interview } from './interview.entity';

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

  // Relationships
  @ManyToOne(() => Student, (student) => student.cvs, { nullable: true })
  @JoinColumn({ name: 'studentID' })
  student: Student;

}
