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
    const queryRunner = this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdUser = await this.userService.createUserTransactional(
        dto.user,
        queryRunner.manager
      );

      const company = queryRunner.manager.create(Company, {
        ...dto.company,
        userID: createdUser.userID,
      });

      const savedCompany = await queryRunner.manager.save(Company, company);
      
      await queryRunner.commitTransaction();
      return savedCompany;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create company: ${error.message}`
      );
    } finally {
      await queryRunner.release();
    }
  }

async bulkCreate(createCompanyDtos: CreateCompanyDto[]) {
  const successful: Company[] = [];
  const failed: { dto: CreateCompanyDto; error: string }[] = [];

  for (let i = 0; i < createCompanyDtos.length; i++) {
    const queryRunner = this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dto = createCompanyDtos[i];
      
      const createdUser = await this.userService.createUserTransactional(
        dto.user,
        queryRunner.manager
      );
      const company = queryRunner.manager.create(Company, {
        ...dto.company,
        userID: createdUser.userID,
      });

      const savedCompany = await queryRunner.manager.save(Company, company);
      
      await queryRunner.commitTransaction();
      successful.push(savedCompany);
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      failed.push({
        dto: createCompanyDtos[i],
        error: error.message || 'Failed to create company',
      });
    } finally {
      await queryRunner.release();
    }
  }

  return {
    successful,
    failed,
    summary: {
      total: createCompanyDtos.length,
      successful: successful.length,
      failed: failed.length,
    },
  };
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