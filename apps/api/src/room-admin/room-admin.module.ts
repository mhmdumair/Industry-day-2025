import { Module } from '@nestjs/common';
import { RoomAdminService } from './room-admin.service';
import { RoomAdminController } from './room-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomAdmin } from './entities/room-admin.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAdmin]), UserModule],
  controllers: [RoomAdminController],
  providers: [RoomAdminService],
})
export class RoomAdminModule {}
