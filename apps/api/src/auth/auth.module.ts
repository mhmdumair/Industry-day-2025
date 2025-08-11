import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/google.strategy';
import { SessionSerializer } from './session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { StudentModule } from 'src/student/student.module';
import { CompanyModule } from 'src/company/company.module';
import { AdminModule } from 'src/admin/admin.module';
import { RoomAdminModule } from 'src/room-admin/room-admin.module';
import { LocalStrategy } from './utils/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
    UserModule,
    StudentModule,
    AdminModule,
    CompanyModule,
    RoomAdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}