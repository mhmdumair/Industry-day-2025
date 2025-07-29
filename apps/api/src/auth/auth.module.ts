import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/google.strategy';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { SessionSerializer } from './session.serializer';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import {StudentService} from "../student/student.service";
import {Student} from "../student/entities/student.entity";
import { StudentModule } from 'src/student/student.module';
import { CompanyModule } from 'src/company/company.module';
import { AdminModule } from 'src/admin/admin.module';
import { RoomAdminModule } from 'src/room-admin/room-admin.module';
import { AdminService } from 'src/admin/admin.service';
import { RoomAdminService } from 'src/room-admin/room-admin.service';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student]),
    PassportModule.register({ session: true }),
    StudentModule,
    AdminModule,
    CompanyModule,
    RoomAdminModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    StudentService,
    GoogleStrategy,
    GoogleAuthGuard,
    SessionSerializer,
    UserService,
  ],
})
export class AuthModule {}
