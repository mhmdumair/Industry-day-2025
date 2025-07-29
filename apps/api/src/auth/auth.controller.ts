import { Controller, Get, UseGuards, Req, Res, NotFoundException } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { StudentService } from '../student/student.service';
import { CompanyService } from 'src/company/company.service';
import { AdminService } from 'src/admin/admin.service';
import { RoomAdminService } from 'src/room-admin/room-admin.service';


@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UserService,
      private readonly studentService: StudentService,
      private readonly companyService:CompanyService,
      private readonly adminService : AdminService,
      private readonly roomAdminService :RoomAdminService,
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
    const googleUser = req.user;

    try {
      let user = await this.usersService.fetchUserByEmail(googleUser.email);

      if (!user) {
        throw new NotFoundException("User not found")
        
      }
      
      if(user.role.toLowerCase()==="student"){
        return res.redirect(
          `http://localhost:3000/home?id=${user.userID}`)
      }
      else if(user.role.toLowerCase()==="company"){
        return res.redirect(
          `http://localhost:3000/home?id=${user.userID}`)
      }
      else if(user.role.toLowerCase()==="admin"){
        return res.redirect(
          `http://localhost:3000/home?id=${user.userID}`)
      }
      else{
        return res.redirect(
          `http://localhost:3000/home?id=${user.userID}`)
      }
      
    } catch (error) {
      console.error('Authentication failed:', error.message);
      return res.redirect(
          `http://localhost:3000/auth/error?message=${encodeURIComponent(
              error.message,
          )}`,
      );
    }
  }
}
