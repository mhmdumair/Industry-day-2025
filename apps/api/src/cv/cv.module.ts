// src/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Student, StudentCv } from '../typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCv,Student])],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
