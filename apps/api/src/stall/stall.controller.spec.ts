import { Test, TestingModule } from '@nestjs/testing';
import { StallController } from './stall.controller';
import { StallService } from './stall.service';

describe('StallController', () => {
  let controller: StallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StallController],
      providers: [StallService],
    }).compile();

    controller = module.get<StallController>(StallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
