import { Test, TestingModule } from '@nestjs/testing';
import { StallService } from './stall.service';

describe('StallService', () => {
  let service: StallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StallService],
    }).compile();

    service = module.get<StallService>(StallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
