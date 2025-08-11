// src/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Student, StudentCv } from '../typeorm/entities';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCv,Student]),StudentModule],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
