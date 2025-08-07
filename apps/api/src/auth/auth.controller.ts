import {Controller, Get, UseGuards, Req, Res, UnauthorizedException, Post} from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { Response } from 'express';
import {LocalAuthGuard} from "./utils/local-auth.gaurd";

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  // The controller no longer needs all the extra services for this flow
  constructor() {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { msg: 'Redirecting to Google for authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {

    try {
      const user = req.user;

      // The logic for redirecting based on role can stay the same
      return res.redirect(`http://localhost:3000/home?id=${user.userID}`);

    } catch (error) {
      console.error('Redirect failed:', error.message);

      const message = (error instanceof UnauthorizedException)
          ? error.message
          : 'An unexpected error occurred during login.';

      return res.redirect(
          `http://localhost:3000/login?error=${encodeURIComponent(message)}`,
      );
    }
  }

  @Post('login')
@UseGuards(LocalAuthGuard)
async login(@Req() req: AuthenticatedRequest) {
  const user = req.user;
  
  // Return JSON response instead of redirect
  return {
    success: true,
    message: 'Login successful',
    user: {
      userID: user.userID,
      email: user.email,
      role: user.role
    },
    redirectUrl: `http://localhost:3000/home?id=${user.userID}`
  };
}

}