import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPrelist } from '../typeorm/entities/company/company-prelist.entity';
import { CreatePreListDto } from './dto/create-pre-list.dto';
import { UpdatePreListDto } from './dto/update-pre-list.dto';

@Injectable()
export class PreListService {
  constructor(
    @InjectRepository(CompanyPrelist)
    private readonly preListRepository: Repository<CompanyPrelist>,
  ) {}

  async create(createPreListDto: CreatePreListDto): Promise<CompanyPrelist> {
    const preList = this.preListRepository.create(createPreListDto);
    return await this.preListRepository.save(preList);
  }

  async findAll(): Promise<CompanyPrelist[]> {
    return await this.preListRepository.find({
      relations: ['company', 'student', 'company.user', 'student.user'],
    });
  }

  async findOne(id: string): Promise<CompanyPrelist> {
    const preList = await this.preListRepository.findOne({
      where: { prelistID: id },
      relations: ['company', 'student', 'company.user', 'student.user'],
    });
    if (!preList) {
      throw new NotFoundException(`PreList with ID ${id} not found`);
    }
    return preList;
  }

  async update(id: string, updatePreListDto: UpdatePreListDto): Promise<CompanyPrelist> {
    const preList = await this.preListRepository.preload({
      prelistID: id,
      ...updatePreListDto,
    });
    if (!preList) {
      throw new NotFoundException(`PreList with ID ${id} not found`);
    }
    return await this.preListRepository.save(preList);
  }

  async getPreListByCompanyId(companyID: string): Promise<CompanyPrelist[]> {
    return await this.preListRepository.find({
      where: { companyID },
      relations: ['company', 'student', 'company.user', 'student.user'],
    });
  }

  async getPreListByStudentId(studentID: string): Promise<CompanyPrelist[]> {
    return await this.preListRepository.find({
      where: { studentID },
      relations: ['company', 'student', 'company.user', 'student.user'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.preListRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PreList with ID ${id} not found`);
    }
  }
}
