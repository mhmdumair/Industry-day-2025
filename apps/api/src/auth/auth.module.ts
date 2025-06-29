import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { UsersService } from '../users/service/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/user/user.entity';
import { PassportModule } from '@nestjs/passport';
import {SessionSerializer} from "./session.serializer";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, UsersService, SessionSerializer],
})
export class AuthModule {}
