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
    try {
      const createdUser = await this.userService.createUser(createAdminDto.user);

      const admin = this.adminRepository.create({
        ...createAdminDto.admin,
        userID: createdUser.userID,
      });
      return await this.adminRepository.save(admin);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create admin');
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

  remove(id: string): string {
    return "delete admin";
  }
}
