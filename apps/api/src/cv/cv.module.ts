import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Student, StudentCv } from '../typeorm/entities';
import { StudentModule } from 'src/student/student.module';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCv, Student]), 
    forwardRef(() => StudentModule), 
    ConfigModule
],
  controllers: [CvController],
  providers: [CvService, GoogleDriveService],
  exports:[
      CvService, 
      TypeOrmModule.forFeature([StudentCv]) 
  ] 
})
export class CvModule {}
