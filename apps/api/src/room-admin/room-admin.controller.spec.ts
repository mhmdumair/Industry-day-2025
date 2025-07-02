import { Test, TestingModule } from '@nestjs/testing';
import { RoomAdminController } from './room-admin.controller';
import { RoomAdminService } from './room-admin.service';

describe('RoomAdminController', () => {
  let controller: RoomAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomAdminController],
      providers: [RoomAdminService],
    }).compile();

    controller = module.get<RoomAdminController>(RoomAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
