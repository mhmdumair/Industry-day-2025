import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStallDto } from './dto/create-stall.dto';
import { UpdateStallDto } from './dto/update-stall.dto';
import { Stall } from './entities/stall.entity';

@Injectable()
export class StallService {
  constructor(
    @InjectRepository(Stall) private stallRepository: Repository<Stall>,
  ) {}

  async create(createStallDto: CreateStallDto) {
    try {
      const stall = this.stallRepository.create(createStallDto);
      return await this.stallRepository.save(stall);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create stall');
    }
  }

  async findAll() {
    try {
      return await this.stallRepository.find({
        relations: ['room', 'company', 'company.user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stalls');
    }
  }

  async findByRoomId(roomID: string) {
    try {
      const stalls = await this.stallRepository.find({ 
        where: { roomID },
        relations: ['room', 'company', 'company.user'],
      });
      return stalls;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stalls by room ID');
    }
  }

  async findByCompanyId(companyID: string) {
    try {
      const stalls = await this.stallRepository.find({ 
        where: { companyID },
        relations: ['room', 'company', 'company.user'],
      });
      return stalls;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stalls by company ID');
    }
  }

  async findOne(id: string) {
    try {
      const stall = await this.stallRepository.findOne({ 
        where: { stallID: id },
        relations: ['room', 'company', 'company.user'],
      });
      if (!stall) throw new NotFoundException(`Stall with ID ${id} not found`);
      return stall;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch stall');
    }
  }

  async update(id: string, updateStallDto: UpdateStallDto) {
    try {
      const stall = await this.stallRepository.findOne({ 
        where: { stallID: id },
        relations: ['room', 'company', 'company.user'],
      });
      if (!stall) throw new NotFoundException(`Stall with ID ${id} not found`);
      const updatedStall = this.stallRepository.merge(stall, updateStallDto);
      return await this.stallRepository.save(updatedStall);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update stall');
    }
  }

  async remove(id: string) {
    try {
      const stall = await this.stallRepository.findOne({ 
        where: { stallID: id },
        relations: ['room', 'company', 'company.user'],
      });
      if (!stall) throw new NotFoundException(`Stall with ID ${id} not found`);
      await this.stallRepository.remove(stall);
      return { message: `Stall with ID ${id} removed` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove stall');
    }
  }
}
