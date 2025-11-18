import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { StudentModule } from 'src/student/student.module';
import { AdminModule } from 'src/admin/admin.module';
import { RoomAdminModule } from 'src/room-admin/room-admin.module';
import { CompanyModule } from 'src/company/company.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule,
    forwardRef(() => StudentModule),
    forwardRef(() => AdminModule),
    forwardRef(() => RoomAdminModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}