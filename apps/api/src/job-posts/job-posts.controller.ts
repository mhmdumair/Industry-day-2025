import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobPostsService } from './job-posts.service';

@Controller('job-posts')
export class JobPostsController {
  constructor(private readonly jobPostsService: JobPostsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadJobPost(
    @UploadedFile() file: Express.Multer.File,
    @Body('companyID') companyID: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!companyID) {
      throw new BadRequestException('Company ID is required');
    }

    return this.jobPostsService.uploadJobPost(companyID, file);
  }

  @Get()
  findAll() {
    return this.jobPostsService.findAll();
  }

  @Get('company/:companyID')
  findByCompany(@Param('companyID') companyID: string) {
    return this.jobPostsService.findByCompany(companyID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostsService.remove(id);
  }
}