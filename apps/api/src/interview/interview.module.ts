import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, Interview, Stall } from 'src/typeorm/entities';

@Module({
  imports : [TypeOrmModule.forFeature([Interview,Stall])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
