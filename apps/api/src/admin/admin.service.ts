import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

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
      const createdUser = await this.userService.createUserTransactional(
        createAdminDto.user,
        queryRunner.manager
      );

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

  async updateProfilePicture(adminID: string, file: Express.Multer.File): Promise<User> {
    const admin = await this.findOne(adminID);
    
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminID} not found.`);
    }

    const user = await this.userService.fetchUserById(admin.userID);
    if (!user) {
        throw new NotFoundException('Associated user account not found.');
    }

    const oldPublicId = user.profile_picture_public_id;

    const updatedUser = await this.userService.updateProfilePicture(
        user.userID,
        file,
        oldPublicId
    );
    
    return updatedUser;
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
    const queryRunner = this.adminRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const admin = await queryRunner.manager.findOne(Admin, {
        where: { adminID: id },
        relations: ['user'],
      });

      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      const { user: userDto, ...adminFields } = updateAdminDto;
      
      Object.assign(admin, adminFields);

      if (userDto) {
        await this.userService.updateUserInTransaction(
          admin.userID,
          userDto,
          queryRunner.manager
        );
      }

      await queryRunner.manager.save(Admin, admin);

      await queryRunner.commitTransaction();

      const updatedAdmin = await this.adminRepository.findOne({
        where: { adminID: id },
        relations: ['user'],
      });

      if (!updatedAdmin) {
        throw new NotFoundException(`Admin with ID ${id} not found after update`);
      }

      return updatedAdmin;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update admin: ${error.message}`);
    } finally {
      await queryRunner.release();
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