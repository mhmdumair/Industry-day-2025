import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { Interview } from '../typeorm/entities/student/interview.entity';
import { Queue } from '../typeorm/entities/queue/queue.entity';
import { Stall } from '../typeorm/entities/facility/stall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, Queue, Stall])],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
