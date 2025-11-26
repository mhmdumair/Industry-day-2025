import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { UserModule } from 'src/user/user.module';
import { CvModule } from 'src/cv/cv.module';
import { StudentCv } from 'src/typeorm/entities';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
imports : [
TypeOrmModule.forFeature([Student, StudentCv]),
CloudinaryModule,
forwardRef(() => UserModule),
forwardRef(() => CvModule)
],
controllers: [StudentController],
providers: [StudentService],
exports : [StudentService]
})
export class StudentModule {}