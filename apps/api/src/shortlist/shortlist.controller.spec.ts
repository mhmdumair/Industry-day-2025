import { Test, TestingModule } from '@nestjs/testing';
import { ShortlistController } from './shortlist.controller';
import { ShortlistService } from './shortlist.service';

describe('ShortlistController', () => {
  let controller: ShortlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortlistController],
      providers: [ShortlistService],
    }).compile();

    controller = module.get<ShortlistController>(ShortlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
