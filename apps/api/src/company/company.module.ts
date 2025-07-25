import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from 'src/typeorm/entities/company/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [TypeOrmModule.forFeature([Company]),UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
