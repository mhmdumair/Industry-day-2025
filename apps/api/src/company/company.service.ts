import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const createdUser = await this.userService.createUser(createCompanyDto.user);
      const company = this.companyRepository.create({
        ...createCompanyDto.company,
        userID: createdUser.userID,
      });
      return await this.companyRepository.save(company);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.companyRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch companies');
    }
  }

  async findOne(id: string): Promise<Company | null> {
    try {
      return await this.companyRepository.findOne({ where: { companyID: id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch company');
    }
  }

  async findByUserId(userId: string): Promise<Company | null> {
    try {
      return await this.companyRepository.findOne({ where: { userID: userId } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch company by userID');
    }
  }

  async filterByStream(stream?: string, location?: string): Promise<Company[]> {
    try {
      const where: any = {};
      if (stream) where.stream = stream;
      if (location) where.location = location;
      return await this.companyRepository.find({ where });
    } catch (error) {
      throw new InternalServerErrorException('Failed to filter companies');
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({ where: { companyID: id } });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      const updatedCompany = this.companyRepository.merge(company, updateCompanyDto);
      return await this.companyRepository.save(updatedCompany);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const company = await this.companyRepository.findOne({ where: { companyID: id } });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      await this.companyRepository.remove(company);
      return { message: `Company with ID ${id} removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove company');
    }
  }
}
