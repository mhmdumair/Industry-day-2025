import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';

@Module({
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
