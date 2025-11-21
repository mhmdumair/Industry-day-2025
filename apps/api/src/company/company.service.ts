import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from 'src/user/user.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'; 

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPublic(dto: CreateCompanyDto): Promise<Company> {
    const queryRunner = this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdUser = await this.userService.createUserTransactional(
        dto.user,
        queryRunner.manager,
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
        `Failed to create company (Public): ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async create(dto: CreateCompanyDto, logoFile?: Express.Multer.File): Promise<Company> {
    const queryRunner = this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let logoUrl: string | undefined;
    let logoPublicId: string | undefined;

    try {
      if (logoFile) {
        const uploadResult = await this.cloudinaryService.uploadCompanyLogo(logoFile);
        logoUrl = uploadResult.secure_url;
        logoPublicId = uploadResult.public_id;
      }

      const createdUser = await this.userService.createUserTransactional(
        dto.user,
        queryRunner.manager,
      );

      const company = queryRunner.manager.create(Company, {
        ...dto.company,
        userID: createdUser.userID,
        logo: logoUrl || dto.company.logo, 
        logoPublicId: logoPublicId || dto.company.logoPublicId,
      });

      const savedCompany = await queryRunner.manager.save(Company, company);

      await queryRunner.commitTransaction();
      return savedCompany;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create company (Internal/File Upload): ${error.message}`,
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
          queryRunner.manager,
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
      if (!company)
        throw new NotFoundException(`Company for user ${userId} not found`);
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
      return null;
    }
  }

  async update(id: string, dto: UpdateCompanyDto, logoFile?: Express.Multer.File): Promise<Company> {
    const queryRunner = this.companyRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let company = await queryRunner.manager.findOne(Company, {
        where: { companyID: id },
      });
      if (!company) throw new NotFoundException(`Company ${id} not found`);

      let newLogoUrl: string | undefined;
      let newLogoPublicId: string | undefined;
      const oldLogoPublicId = company.logoPublicId;

      if (dto.user && company.userID) {
        await this.userService.updateUserInTransaction(company.userID, dto.user, queryRunner.manager);
      }

      const { user, ...companyUpdateFields } = dto;

      if (logoFile) {
        const uploadResult = await this.cloudinaryService.uploadCompanyLogo(logoFile);
        newLogoUrl = uploadResult.secure_url;
        newLogoPublicId = uploadResult.public_id;
        
        if (oldLogoPublicId) {
          await this.cloudinaryService.deleteFile(oldLogoPublicId);
        }
        
        companyUpdateFields.logo = newLogoUrl;
        companyUpdateFields.logoPublicId = newLogoPublicId;
        
      } else {
          if ('logo' in dto && dto.logo === null) {
              
              if (oldLogoPublicId) {
                await this.cloudinaryService.deleteFile(oldLogoPublicId);
              }
              
              companyUpdateFields.logo = null;
              companyUpdateFields.logoPublicId = null;
          }
      }

      company = queryRunner.manager.merge(Company, company, companyUpdateFields) as Company;

      await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(`Failed to update company: ${e.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyID: id },
      });
      if (!company) throw new NotFoundException(`Company ${id} not found`);

      const userID = company.userID;
      const logoPublicId = company.logoPublicId;

      await this.companyRepository.remove(company);
      await this.userService.removeUser(userID);

      if (logoPublicId) {
        await this.cloudinaryService.deleteFile(logoPublicId);
      }

      return { message: `Company ${id} removed` };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to remove company');
    }
  }
}