import {Controller, Get, UseGuards, Req, Res, UnauthorizedException, Post} from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { Response } from 'express';
import {LocalAuthGuard} from "./utils/local-auth.gaurd";

// We define a clearer type for the request object after authentication
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
    // The GoogleAuthGuard has already run and attached the user to `req.user`.
    // If the user didn't exist, the guard would have already thrown an error.
    try {
      const user = req.user;

      // The logic for redirecting based on role can stay the same
      return res.redirect(`http://localhost:3000/home?id=${user.userID}`);

    } catch (error) {
      // This catch block will handle any unexpected errors during the redirect
      console.error('Redirect failed:', error.message);

      // Redirect to a generic error page on the frontend
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
  async login(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    // If the LocalStrategy succeeds, the user is attached to req.user
    const user = req.user;
    // Redirect to the homepage just like with the Google login
    return res.redirect(`http://localhost:3000/home?id=${user.userID}`);
  }
}