import { UserRole } from '../typeorm/entities/user.entity';

// createUserParams
export interface CreateUserParams {
  email: string;
  role: UserRole;
  google_id: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  email_verified?: boolean;
  is_active?: boolean;
}
