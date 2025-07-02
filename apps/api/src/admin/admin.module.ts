import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Admin } from 'src/typeorm/entities/user/admin.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Admin]),UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
