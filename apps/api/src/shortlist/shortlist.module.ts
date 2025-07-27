import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortlistService } from './shortlist.service';
import { ShortlistController } from './shortlist.controller';
import { CompanyShortlist } from '../typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyShortlist])],
  controllers: [ShortlistController],
  providers: [ShortlistService],
  exports: [ShortlistService],
})
export class ShortlistModule {}
