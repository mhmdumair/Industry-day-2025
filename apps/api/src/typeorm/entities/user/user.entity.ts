import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Admin } from './admin.entity';
import { Student } from './student.entity';
import { RoomAdmin } from './room-admin.entity';
import { Company } from '../company/company.entity';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  ROOM_ADMIN = 'room_admin',
  COMPANY = 'company',
}

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 6 })
  userID: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({nullable:true})
  first_name: string;

  @Column({nullable:true})
  last_name: string;

  @Column({ nullable: true })
  profile_picture: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  admin: Admin | null;

  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  student: Student | null;

  @OneToOne(() => RoomAdmin, (roomAdmin) => roomAdmin.user, { nullable: true })
  roomAdmin: RoomAdmin | null;

  @OneToOne(() => Company, (company) => company.user, { nullable: true })
  company: Company | null;
}
