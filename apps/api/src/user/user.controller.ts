import { Body, Controller, Get, Param, Post, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { StudentService } from 'src/student/student.service';
import { CompanyService } from 'src/company/company.service';
import { AdminService } from 'src/admin/admin.service';
import { RoomAdminService } from 'src/room-admin/room-admin.service';

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly studentService: StudentService,
    private readonly companyService: CompanyService,
    private readonly adminService: AdminService,
    private readonly roomAdminService: RoomAdminService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.usersService.fetchUsers();
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.createUser(createUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboardRedirect(@Req() req: AuthenticatedRequest) {
    try {
      const user = req.user;
      const role = user.role.toLowerCase();

      if (role === 'student') {
        const student = await this.studentService.findByUserId(user.userID);
        if (!student) {
          throw new NotFoundException('Student profile not found.');
        }
        return { redirectUrl: `/student/profile` };
      } else if (role === 'company') {
        const company = await this.companyService.findByUserId(user.userID);
        if (!company) {
          throw new NotFoundException('Company profile not found.');
        }
        return { redirectUrl: `/company/profile` };
      } else if (role === 'admin') {
        const admin = await this.adminService.findByUserId(user.userID);
        if (!admin) {
          throw new NotFoundException('Admin profile not found.');
        }
        return { redirectUrl: `/admin/profile` };
      } else if (role === 'room_admin') {
        const roomAdmin = await this.roomAdminService.findByUserId(user.userID);
        if (!roomAdmin) {
          throw new NotFoundException('Room admin profile not found.');
        }
        return { redirectUrl: `/room-admin/profile` };
      }

      return { redirectUrl: '/home' };
    } catch (error) {
      console.error('An error occurred in getDashboardRedirect:', error);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.fetchUserById(id);
  }
}