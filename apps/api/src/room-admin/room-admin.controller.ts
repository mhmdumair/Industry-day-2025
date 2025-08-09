import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomAdminService } from './room-admin.service';
import { CreateRoomAdminDto } from './dto/create-room-admin.dto';
import { UpdateRoomAdminDto } from './dto/update-room-admin.dto';

@Controller('room-admin')
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roomAdminService.findOne(id);
  }

  @Get('by-user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.roomAdminService.findByUserId(userId);
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
