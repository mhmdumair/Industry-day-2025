import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RoomAdminService } from './room-admin.service';
import { CreateRoomAdminDto } from './dto/create-room-admin.dto';
import { UpdateRoomAdminDto } from './dto/update-room-admin.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('room-admin')
@UseGuards(JwtAuthGuard)
export class RoomAdminController {
  constructor(private readonly roomAdminService: RoomAdminService) {}

  @Post()
  async create(@Body() createRoomAdminDto: CreateRoomAdminDto) {
    return this.roomAdminService.create(createRoomAdminDto);
  }

  @Get()
  async findAll() {
    return this.roomAdminService.findAll();
  }

  @Get('by-user') // THIS ROUTE MUST BE FIRST
  async findByAuthenticatedUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID;
    return this.roomAdminService.findByUserId(userId);
  }
  
  @Get(':id') // THE DYNAMIC ROUTE MUST COME AFTER SPECIFIC ONES
  async findOne(@Param('id') id: string) {
    return this.roomAdminService.findOne(id);
  }

  @Get('by-room/:roomId')
  async findByRoomId(@Param('roomId') roomId: string) {
    return this.roomAdminService.findByRoomId(roomId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoomAdminDto: UpdateRoomAdminDto) {
    return this.roomAdminService.update(id, updateRoomAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roomAdminService.remove(id);
  }
}