import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomAdminService } from './room-admin.service';
import { CreateRoomAdminDto } from './dto/create-room-admin.dto';
import { UpdateRoomAdminDto } from './dto/update-room-admin.dto';

@Controller('room-admin')
export class RoomAdminController {
  constructor(private readonly roomAdminService: RoomAdminService) {}

  @Post()
  create(@Body() createRoomAdminDto: CreateRoomAdminDto) {
    return this.roomAdminService.create(createRoomAdminDto);
  }

  @Get()
  findAll() {
    return this.roomAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomAdminDto: UpdateRoomAdminDto) {
    return this.roomAdminService.update(+id, updateRoomAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomAdminService.remove(+id);
  }
}
