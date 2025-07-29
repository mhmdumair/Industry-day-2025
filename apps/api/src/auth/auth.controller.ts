import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { StudentService } from '../student/student.service';
import { UserRole } from '../user/entities/user.entity';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UserService,
      private readonly studentService: StudentService,
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
        const createStudentDto = plainToInstance(CreateStudentDto, {
          user: {
            email: googleUser.email,
            first_name: googleUser.first_name,
            last_name: googleUser.last_name,
            profile_picture: googleUser.profile_picture,
            role: UserRole.STUDENT,
          },
          student: {
            regNo: null,
            nic: null,
            contact: null,
            linkedin: null,
            group: null,
            level: null,
          },
      });

        await validateOrReject(createStudentDto);

        const student = await this.studentService.create(createStudentDto);
      }

      return res.redirect(`http://localhost:3000/home`);
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
