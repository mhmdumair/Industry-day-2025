import { Injectable } from '@nestjs/common';
import { CreatePreListDto } from './dto/create-pre-list.dto';
import { UpdatePreListDto } from './dto/update-pre-list.dto';

@Injectable()
export class PreListService {
  create(createPreListDto: CreatePreListDto) {
    return 'This action adds a new preList';
  }

  findAll() {
    return `This action returns all preList`;
  }

  findOne(id: string) {
    return `This action returns a #${id} preList`;
  }

  update(id: string, updatePreListDto: UpdatePreListDto) {
    return `This action updates a #${id} preList`;
  }

  remove(id: string) {
    return `This action removes a #${id} preList`;
  }
}
