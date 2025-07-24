import { Test, TestingModule } from '@nestjs/testing';
import { PreListService } from './pre-list.service';

describe('PreListService', () => {
  let service: PreListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreListService],
    }).compile();

    service = module.get<PreListService>(PreListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
