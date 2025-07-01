import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/typeorm/entities/user/student.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [TypeOrmModule.forFeature([Student]),UserModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
