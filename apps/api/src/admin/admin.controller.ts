import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('admin')
@UseGuards(JwtAuthGuard) 
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }
  
  @Get('by-user')
  findAdminByUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID; 
    return this.adminService.findByUserId(userId);
  }

  @Get('profile')
  getAdminProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID; 
    return this.adminService.findByUserId(userId);
  }

  @Patch('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile picture file is required.');
    }

    const admin = await this.adminService.findByUserId(req.user.userID);

    if (!admin) {
      throw new NotFoundException('Admin profile not found for the authenticated user.');
    }

    const updatedUser = await this.adminService.updateProfilePicture(
      admin.adminID,
      file,
    );

    return {
      message: 'Profile picture updated successfully',
      profile_picture: updatedUser.profile_picture,
      profile_picture_public_id: updatedUser.profile_picture_public_id,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}