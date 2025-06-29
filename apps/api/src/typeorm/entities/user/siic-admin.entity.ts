import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('siic_admins')
export class SiicAdmin {
  @PrimaryGeneratedColumn('uuid')
  siicAdminID: string;

  @Column()
  userID: string;

  @Column()
  designation: string;

  // Removed firstName and lastName since they're now in User entity as first_name and last_name
  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.siicAdmin)
  @JoinColumn({ name: 'userID' })
  user: User;
}
