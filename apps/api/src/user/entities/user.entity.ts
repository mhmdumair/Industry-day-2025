import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';
import { Student } from '../../student/entities/student.entity';
import { RoomAdmin } from '../../room-admin/entities/room-admin.entity';
import { Company } from '../../company/entities/company.entity';
import { Announcement } from '../../announcement/entities/announcement.entity';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  ROOM_ADMIN = 'room_admin',
  COMPANY = 'company',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') 
  userID: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
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

  @OneToMany(() => Announcement, (announcement) => announcement.postedByUser, { nullable: true })
  @OneToMany(() => Announcement, (announcement) => announcement.postedByUser)
  announcements: Announcement[];
}
