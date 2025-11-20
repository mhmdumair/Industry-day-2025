import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Admin } from 'src/admin/entities/admin.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports : [TypeOrmModule.forFeature([Admin]),
  forwardRef(() => UserModule),
  CloudinaryModule],
  
  controllers: [AdminController],
  providers: [AdminService],
  exports : [AdminService]
})
export class AdminModule {}
