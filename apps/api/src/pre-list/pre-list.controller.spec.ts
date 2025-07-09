import { Test, TestingModule } from '@nestjs/testing';
import { PreListController } from './pre-list.controller';
import { PreListService } from './pre-list.service';

describe('PreListController', () => {
  let controller: PreListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreListController],
      providers: [PreListService],
    }).compile();

    controller = module.get<PreListController>(PreListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
