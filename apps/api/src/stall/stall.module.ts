import { Module } from '@nestjs/common';
import { StallService } from './stall.service';
import { StallController } from './stall.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stall } from 'src/typeorm/entities';
import { InterviewModule } from 'src/interview/interview.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stall]),InterviewModule],
  controllers: [StallController],
  providers: [StallService],
})
export class StallModule {}
