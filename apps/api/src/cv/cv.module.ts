// src/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Student, StudentCv } from '../typeorm/entities';
import { PDFStorageService } from '../lib/services/pdf-storage.service'; // Updated path

@Module({
  imports: [TypeOrmModule.forFeature([StudentCv,Student])],
  controllers: [CvController],
  providers: [CvService, PDFStorageService],
  exports: [PDFStorageService],
})
export class CvModule {}
