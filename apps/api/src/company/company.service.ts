import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private readonly userService: UserService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const createdUser = await this.userService.createUser(createCompanyDto.user);
    const company = this.companyRepository.create({
      ...createCompanyDto.company,
      userID: createdUser.userID,
    });
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: string): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { companyID: id } });
  }

  findByUserId(userId: string): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { userID: userId } });
  }

  async filterByStream(stream?: string, location?: string): Promise<Company[]> {
    const where: any = {};
    if (stream) where.stream = stream;
    if (location) where.location = location;
    return this.companyRepository.find({ where });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { companyID: id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    const updatedCompany = this.companyRepository.merge(company, updateCompanyDto);
    return this.companyRepository.save(updatedCompany);
  }

  async remove(id: string): Promise<any> {
    const company = await this.companyRepository.findOne({ where: { companyID: id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    await this.companyRepository.remove(company);
    return { message: `Company with ID ${id} removed` };
  }
}
