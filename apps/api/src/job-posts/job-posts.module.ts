import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JobPostsService } from './job-posts.service';
import { JobPostsController } from './job-posts.controller';
import { JobPost } from '../job-posts/entities/job-post.entity';
import { GoogleDriveModule } from 'src/google-drive/google-drive.module';
import { CompanyModule } from 'src/company/company.module';
import { Company } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost, Company]),
    ConfigModule,
    GoogleDriveModule,
    forwardRef(() => CompanyModule),
  ],
  controllers: [JobPostsController],
  providers: [JobPostsService],
  exports: [
    JobPostsService,
    TypeOrmModule.forFeature([JobPost])
  ]
})
export class JobPostsModule {}