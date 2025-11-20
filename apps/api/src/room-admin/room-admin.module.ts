import { forwardRef, Module } from '@nestjs/common';
import { RoomAdminService } from './room-admin.service';
import { RoomAdminController } from './room-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomAdmin } from './entities/room-admin.entity';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports : [TypeOrmModule.forFeature([RoomAdmin]),forwardRef(() => UserModule),CloudinaryModule],
  controllers: [RoomAdminController],
  providers: [RoomAdminService],
  exports : [RoomAdminService]
})
export class RoomAdminModule {}
