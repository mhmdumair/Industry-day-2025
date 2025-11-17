import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Student, StudentCv } from '../typeorm/entities';
import { StudentModule } from 'src/student/student.module';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleDriveModule } from 'src/google-drive/google-drive.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCv, Student]), 
    forwardRef(() => StudentModule), 
    ConfigModule,
    forwardRef(() => GoogleDriveModule)
    
],
  controllers: [CvController],
  providers: [CvService],
  exports:[
      CvService,   ] 
})
export class CvModule {}
