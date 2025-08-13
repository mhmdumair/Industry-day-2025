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

      return res.redirect(`${process.env.FRONTEND_URL}/home?id=${user.userID}`);

    } catch (error) {
      console.error('Redirect failed:', error.message);

      const message = (error instanceof UnauthorizedException)
          ? error.message
          : 'An unexpected error occurred during login.';

      return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(message)}`,
      );
    }
  }

  @Post('login')
@UseGuards(LocalAuthGuard)
async login(@Req() req: AuthenticatedRequest) {
  const user = req.user;
  
  return {
    success: true,
    message: 'Login successful',
    user: {
      userID: user.userID,
      email: user.email,
      role: user.role
    },
    redirectUrl: `${process.env.FRONTEND_URL}/home?id=${user.userID}`
  };
}

}