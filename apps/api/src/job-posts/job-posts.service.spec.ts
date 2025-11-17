import { Test, TestingModule } from '@nestjs/testing';
import { JobPostsService } from './job-posts.service';

describe('JobPostsService', () => {
  let service: JobPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPostsService],
    }).compile();

    service = module.get<JobPostsService>(JobPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
