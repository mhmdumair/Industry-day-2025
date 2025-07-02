import { Test, TestingModule } from '@nestjs/testing';
import { RoomAdminService } from './room-admin.service';

describe('RoomAdminService', () => {
  let service: RoomAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomAdminService],
    }).compile();

    service = module.get<RoomAdminService>(RoomAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
