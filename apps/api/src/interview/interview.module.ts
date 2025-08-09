import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, Interview, Stall } from 'src/typeorm/entities';
import { Student, StudentLevel } from 'src/student/entities/student.entity';
import { StudentModule } from 'src/student/student.module';
import { StallModule } from 'src/stall/stall.module';

@Module({
  imports : [TypeOrmModule.forFeature([Interview,Stall,Student]),StudentModule],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports : [InterviewService]
})
export class InterviewModule {}
