import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../admin/entities/admin.entity';
import { Student } from '../../student/entities/student.entity';
import {RoomAdmin} from "../../room-admin/entities/room-admin.entity";
import {Company} from "../../company/entities/company.entity";
import {Announcement} from "../../announcement/entities/announcement.entity";

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

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_picture_public_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }


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
  announcements: Announcement[];
}