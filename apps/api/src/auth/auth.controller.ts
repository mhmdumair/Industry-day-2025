import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';
import { UsersService } from '../users/service/users/users.service';
import { UserRole } from '../typeorm/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('hello')
  getHello() {
    return this.authService.getHello();
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { msg: 'Redirecting to Google for authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req, @Res() res) {
    const googleUser = req.user; // Data from GoogleStrategy.validate()

    try {
      // Check if user already exists by Google ID
      let user = await this.usersService.fetchUserByGoogleId(
        googleUser.google_id,
      );

      if (!user) {
        // Check if user exists by email (in case they signed up differently before)
        user = await this.usersService.fetchUserByEmail(googleUser.email);

        if (user) {
          // User exists with same email, update with Google ID
          // You might want to add an update method to UsersService
          return {
            msg: 'User exists with this email but different auth method',
            user: user,
          };
        } else {
          // Create new user
          user = await this.usersService.createUser({
            email: googleUser.email,
            google_id: googleUser.google_id,
            first_name: googleUser.first_name,
            last_name: googleUser.last_name,
            profile_picture: googleUser.profile_picture,
            role: UserRole.STUDENT, // Default role for new users
            email_verified: true, // Google emails are always verified
            is_active: true,
          });
        }
      }

        return res.redirect(
          `http://localhost:3000/student`);
      // return {
      //   msg: 'Google authentication successful',
      //   user: {
      //     userID: user.userID,
      //     email: user.email,
      //     first_name: user.first_name,
      //     last_name: user.last_name,
      //     role: user.role,
      //     profile_picture: user.profile_picture,
      //   },
      // };
    } catch (error) {
      return {
        msg: 'Authentication failed',
        error: error.message,
      };
    }
  }
}
