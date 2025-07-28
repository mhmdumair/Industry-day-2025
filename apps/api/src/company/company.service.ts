// company.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    try {
      const createdUser = await this.userService.createUser(dto.user);
      const company = this.companyRepository.create({
        ...dto.company,
        userID: createdUser.userID,
      });
      return await this.companyRepository.save(company);
    } catch {
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.companyRepository.find({
        relations: ['user'],
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch companies');
    }
  }

  async findOne(id: string): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyID: id },
        relations: ['user'],
      });
      if (!company) throw new NotFoundException(`Company ${id} not found`);
      return company;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to fetch company');
    }
  }

  async findByUserId(userId: string): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({
        where: { userID: userId },
        relations: ['user'],
      });
      if (!company) throw new NotFoundException(`Company for user ${userId} not found`);
      return company;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to fetch company by userID');
    }
  }

  async getCompanyNameByUserId(userId: string): Promise<string | null> {
    try {
      const company = await this.findByUserId(userId);
      return company?.companyName || null;
    } catch (error) {
      console.error(`Error fetching company name for userId ${userId}:`, error);
      return null;
    }
  }

  async filterByStream(stream?: string, location?: string): Promise<Company[]> {
    try {
      const where: any = {};
      if (stream) where.stream = stream;
      if (location) where.location = location;
      return await this.companyRepository.find({ where, relations: ['user'] });
    } catch {
      throw new InternalServerErrorException('Failed to filter companies');
    }
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyID: id },
        relations: ['user'],
      });
      if (!company) throw new NotFoundException(`Company ${id} not found`);
      const updated = this.companyRepository.merge(company, dto);
      return await this.companyRepository.save(updated);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(id: string) {
    try {
      const company = await this.companyRepository.findOne({ where: { companyID: id } });
      if (!company) throw new NotFoundException(`Company ${id} not found`);
      await this.companyRepository.remove(company);
      return { message: `Company ${id} removed` };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to remove company');
    }
  }
}
