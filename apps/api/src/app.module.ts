import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import * as entities from './typeorm/entities';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { RoomAdminModule } from './room-admin/room-admin.module';
import { CompanyModule } from './company/company.module';
import { RoomModule } from './room/room.module';
import { StallModule } from './stall/stall.module';
import { PreListModule } from './pre-list/pre-list.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { CvModule } from './cv/cv.module';
import { ShortlistModule } from './shortlist/shortlist.module';
import { InterviewModule } from './interview/interview.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM configuration using async factory
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
    StudentModule,
    AdminModule,
    RoomAdminModule,
    CompanyModule,
    RoomModule,
    StallModule,
    PreListModule,
    AnnouncementModule,
    CvModule,
    ShortlistModule,
    InterviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
