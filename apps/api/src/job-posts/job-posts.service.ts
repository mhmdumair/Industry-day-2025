import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class JobPostsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,

    private readonly googleDriveService: GoogleDriveService,

    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  async uploadJobPost(companyID: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required for upload.');
    }
    
    const company = await this.companyService.findOne(companyID); 
    
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyID} not found`);
    }

    let companyDriveFolderId: string;
    const sanitizedCompanyName = company.companyName.replace(/[^a-zA-Z0-9\s]/g, '');
    
    try {
        const rootFolderId = this.googleDriveService.getJobOpeningRootFolderId();
        companyDriveFolderId = await this.googleDriveService.findOrCreateFolder(
            sanitizedCompanyName, 
            rootFolderId
        );
    } catch (error) {
        console.error('Company Folder Error:', error);
        throw new InternalServerErrorException(
            'Failed to find or create company folder in Google Drive.',
        );
    }

    const existingJobPostsCount = await this.jobPostRepository.count({
        where: { companyID: companyID } 
    });
    
    const fileIndex = existingJobPostsCount + 1;

    const parts = file.originalname.split('.');
    const originalExtension = parts.length > 1 ? parts.pop() : 'dat';
    
    const newFileName = `${sanitizedCompanyName}_${fileIndex}.${originalExtension}`; 
    
    let driveFileId: string;
    
    try {
      driveFileId = await this.googleDriveService.uploadJobPosting(
        file, 
        newFileName,
        companyDriveFolderId,
      );
    } catch (error) {
      console.error('Job Post Drive Upload Error:', error);
      throw new InternalServerErrorException(
        'Failed to upload file to Google Drive.',
      );
    }

    const jobPost = this.jobPostRepository.create({
      companyID: company.companyID,
      fileName: driveFileId, 
    });

    const savedJobPost = await this.jobPostRepository.save(jobPost);

    return {
      message: 'Job post uploaded successfully',
      jobPost: savedJobPost,
      driveFileId,
      fileName: newFileName,
    };
  }

  async findAll() {
    return this.jobPostRepository.find({
      relations: ['company'],
    });
  }

  async findByCompany(companyID: string) {
    return this.jobPostRepository.find({
      where: { companyID },
      relations: ['company'],
    });
  }

  async findOne(id: string) {
    const jobPost = await this.jobPostRepository.findOne({
      where: { jobPostID: id },
      relations: ['company'],
    });

    if (!jobPost) {
      throw new NotFoundException(`Job post with ID ${id} not found`);
    }

    return jobPost;
  }

  async remove(id: string) {
    const jobPost = await this.findOne(id);

    try {
      await this.googleDriveService.deleteFile(jobPost.fileName);
    } catch (error) {
      console.error('Failed to delete file from Google Drive:', error);
    }

    await this.jobPostRepository.remove(jobPost);

    return {
      message: 'Job post deleted successfully',
      jobPostID: id,
    };
  }

  async downloadJobPost(id: string) {
    const jobPost = await this.findOne(id);
    
    try {
      const fileData = await this.googleDriveService.downloadFile(jobPost.fileName);
      return fileData;
    } catch (error) {
      throw new BadRequestException(
        `Failed to download file from Google Drive: ${error.message}`,
      );
    }
  }
}