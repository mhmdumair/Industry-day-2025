import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Admin } from './admin.entity';
import { Student } from '../student/student.entity';
import {RoomAdmin} from "./room-admin.entity";
import {SiicAdmin} from "./siic-admin.entity";

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  ROOM_ADMIN = 'room_admin',
  SIIC_ADMIN = 'siic_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  // Google OAuth fields
  @Column({ unique: true })
  google_id: string;

  // Profile fields from Google
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  profile_picture: string;

  // Account status
  @Column({ default: true })
  email_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

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

  @OneToOne(() => SiicAdmin, (siicAdmin) => siicAdmin.user, { nullable: true })
  siicAdmin: SiicAdmin | null;
}
