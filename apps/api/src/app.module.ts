import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './typeorm/entities';
import { UserModule } from './user/user.module';
//import { QueueController } from './queue/queue.controller';
//import { QueueModule } from './queue/queue.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { RoomAdminModule } from './room-admin/room-admin.module';
import { CompanyModule } from './company/company.module';
import { RoomModule } from './room/room.module';
import { StallModule } from './stall/stall.module';
import { PreListModule } from './pre-list/pre-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: Object.values(entities),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    //QueueModule,
    ConfigModule,
    StudentModule,
    AdminModule,
    RoomAdminModule,
    CompanyModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService, AuthService],
})
export class AppModule {}
