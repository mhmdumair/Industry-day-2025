import { Injectable } from '@nestjs/common';
import { CreateStallDto } from './dto/create-stall.dto';
import { UpdateStallDto } from './dto/update-stall.dto';

@Injectable()
export class StallService {
  create(createStallDto: CreateStallDto) {
    return 'This action adds a new stall';
  }

  findAll() {
    return `This action returns all stall`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stall`;
  }

  update(id: number, updateStallDto: UpdateStallDto) {
    return `This action updates a #${id} stall`;
  }

  remove(id: number) {
    return `This action removes a #${id} stall`;
  }
}
