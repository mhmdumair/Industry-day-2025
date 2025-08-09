import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
// import { JwtService } from '@nestjs/jwt'; // <-- REMOVE THIS IMPORT
import { User, UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  // REMOVE JwtService from the constructor
  constructor(private usersService: UserService) {}

  /**
   * Validates a user's password.
   */
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

  /**
   * Handles user logic for Google OAuth.
   */
  async validateGoogleUser(googleUser: { email: string }) {
    const user = await this.usersService.fetchUserByEmail(googleUser.email);

    if (!user) {
      throw new UnauthorizedException(
          'User is not registered. Please use your science email or contact an administrator.',
      );
    }
    return user;
  }

  // The 'login' method below was for JWTs and is no longer used in a session-based flow.
  // You can safely remove it.
  /*
  async login(user: User) {
    const payload = { sub: user.userID, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      userID: user.userID,
    };
  }
  */
}