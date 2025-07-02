import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../typeorm/entities/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UserService,
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
      let user = await this.usersService.fetchUserByEmail(googleUser.email);
  
      
      if (!user) {
        // User exists with same email, update with Google ID
        // You might want to add an update method to UserService
         user = await this.usersService.createUser({
          email: googleUser.email,
          first_name: googleUser.first_name,
          last_name: googleUser.last_name,
          profile_picture: googleUser.profile_picture,
          role: UserRole.STUDENT, // Default role for new user
       
        });
      } 
      const role :string = user.role
      if (role.toLowerCase() == "company"){
        return res.redirect(`http://localhost:3000/company`);
      }
      else if (role.toLowerCase() == "admin"){
        return res.redirect(`http://localhost:3000/admin`);
      }
      else if (role.toLowerCase() == "room_admin"){
        return res.redirect(`http://localhost:3000/room-admin`);
      }else{
        return res.redirect(`http://localhost:3000/student`)
      }
      

    } catch (error) {
      // Handle errors and redirect to error page or return error response
      console.error('Authentication failed:', error.message);
      return res.redirect(`http://localhost:3000/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  }
}
