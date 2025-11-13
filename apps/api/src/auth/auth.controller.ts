import {Controller, Get, UseGuards, Req, Res, UnauthorizedException, Post} from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { Response } from 'express';
import {LocalAuthGuard} from "./utils/local-auth.gaurd";
import { JwtService } from '@nestjs/jwt'; 

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {} 

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

       const payload = { userID: user.userID, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload); 

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      
      return res.redirect(`${process.env.FRONTEND_URL}/home`);

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
async login(@Req() req: AuthenticatedRequest,@Res() res: Response) {
  const user = req.user;

  const payload = { userID: user.userID, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

  return {
    success: true,
    message: 'Login successful',
    user: user,
    redirectUrl: `${process.env.FRONTEND_URL}/home?id=${user.userID}`
  };
}

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }

}