import { Test, TestingModule } from '@nestjs/testing';
import { ShortlistService } from './shortlist.service';

describe('ShortlistService', () => {
  let service: ShortlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortlistService],
    }).compile();

    service = module.get<ShortlistService>(ShortlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
