import { UserRole } from '../entities/user.entity';

// createUserParams
export interface CreateUserParams {
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  created_at?: Date;
  updated_at?: Date;
}