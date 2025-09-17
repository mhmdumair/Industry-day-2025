// src/user/user.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

// Import all required modules for the UserController
import { StudentModule } from 'src/student/student.module';
import { AdminModule } from 'src/admin/admin.module';
import { RoomAdminModule } from 'src/room-admin/room-admin.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => StudentModule), // <-- Use forwardRef to break the loop
    forwardRef(() => AdminModule),
    forwardRef(() => RoomAdminModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}