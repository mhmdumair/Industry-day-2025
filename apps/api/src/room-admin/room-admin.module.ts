import { Module } from '@nestjs/common';
import { RoomAdminService } from './room-admin.service';
import { RoomAdminController } from './room-admin.controller';

@Module({
  controllers: [RoomAdminController],
  providers: [RoomAdminService],
})
export class RoomAdminModule {}
