import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';

@Entity('student_cvs')
export class StudentCv {
  @PrimaryGeneratedColumn('uuid')
  cvID: string;

  @Column()
  studentID: string;

  @Column()
  fileName: string;

  @ManyToOne(() => Student, (student) => student.cvs, { nullable: true })
  @JoinColumn({ name: 'studentID' })
  student: Student;
}