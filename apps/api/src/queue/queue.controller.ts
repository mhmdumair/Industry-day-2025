import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('add')
  async addInterview(@Body() dto: any) {
    await this.queueService.addInterviewToQueue(dto);
    return { message: 'Interview added to queue' };
  }

  @Get(':stallID')
  async getQueue(@Param('stallID') stallID: string) {
    const interviews = await this.queueService.getQueueByStallID(stallID);
    return { stallID, interviews };
  }

  @Post('reset')
  async resetQueues() {
    await this.queueService.resetAllQueues();
    return { message: 'All queues reset' };
  }
}
