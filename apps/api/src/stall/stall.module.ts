import { Module } from '@nestjs/common';
import { StallService } from './stall.service';
import { StallController } from './stall.controller';

@Module({
  controllers: [StallController],
  providers: [StallService],
})
export class StallModule {}
