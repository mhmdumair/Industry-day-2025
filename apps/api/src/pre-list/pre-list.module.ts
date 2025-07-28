import { Module } from '@nestjs/common';
import { PreListService } from './pre-list.service';
import { PreListController } from './pre-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPrelist } from 'src/pre-list/entities/company-prelist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CompanyPrelist])],
  controllers: [PreListController],
  providers: [PreListService],
})
export class PreListModule {}
