import { Module } from '@nestjs/common';
import { PreListService } from './pre-list.service';
import { PreListController } from './pre-list.controller';

@Module({
  controllers: [PreListController],
  providers: [PreListService],
})
export class PreListModule {}
