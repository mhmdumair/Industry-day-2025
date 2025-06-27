import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  google_id: string; // Google's 'sub' field

  // Profile fields from Google
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  profile_picture: string; // Google avatar URL

  // Account status
  @Column({ default: true })
  email_verified: boolean; // Always true for Google users

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
