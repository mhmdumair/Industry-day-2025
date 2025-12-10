import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  
  constructor(private usersService: UserService) {}

  async validateUser(
      email: string,
      pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.fetchUserByEmail(email);

    if (user && user.password && (await user.validatePassword(pass))) {
      const { password, ...result } = user;
      // @ts-ignore
      return result;
    }
    throw new UnauthorizedException('Invalid credentials. Please try again.');
  }

  async validateGoogleUser(googleUser: { email: string }) {
    const user = await this.usersService.fetchUserByEmail(googleUser.email);

    if (!user) {
      throw new UnauthorizedException(
          'User is not registered. Please use your science email or contact an administrator.',
      );
    }
    return user;
  }
}