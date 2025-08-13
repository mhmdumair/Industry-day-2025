import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private readonly userService: UserService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const queryRunner = this.adminRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create user within the transaction
      const createdUser = await this.userService.createUserTransactional(
        createAdminDto.user,
        queryRunner.manager
      );

      // Create admin within the same transaction
      const admin = queryRunner.manager.create(Admin, {
        ...createAdminDto.admin,
        userID: createdUser.userID,
      });

      const savedAdmin = await queryRunner.manager.save(Admin, admin);
      
      await queryRunner.commitTransaction();
      return savedAdmin;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create admin: ${error.message}`
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminRepository.find({
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admins');
    }
  }

  async findOne(id: string): Promise<Admin | null> {
    try {
      return await this.adminRepository.findOne({ 
        where: { adminID: id },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admin');
    }
  }

  async findByUserId(userId: string): Promise<Admin | null> {
    try {
      return await this.adminRepository.findOne({ 
        where: { userID: userId },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admin by userID');
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({ 
        where: { adminID: id },
        relations: ['user'],
      });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }
      const updatedAdmin = this.adminRepository.merge(admin, updateAdminDto);
      return await this.adminRepository.save(updatedAdmin);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update admin');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
  try {
    const admin = await this.adminRepository.findOne({
      where: { adminID: id },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    const userId = admin.userID;

    await this.adminRepository.remove(admin);
    await this.userService.removeUser(userId);

    return {
      message: `Admin ${id} and associated user removed successfully`,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(
      'Failed to remove admin and associated user',
    );
  }
}
}