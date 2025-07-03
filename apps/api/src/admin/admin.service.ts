import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from 'src/typeorm/entities/user/admin.entity';
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
    const createdUser = await this.userService.createUser(createAdminDto.user);

    const admin = this.adminRepository.create({
      ...createAdminDto.admin,
      userID: createdUser.userID,
    });
    return this.adminRepository.save(admin);
  }


  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { adminID: id } });
  }


  async findByUserId(userId: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { userID: userId } });
  }


  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { adminID: id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    const updatedAdmin = this.adminRepository.merge(admin, updateAdminDto);
    return this.adminRepository.save(updatedAdmin);
  }


  remove(id: string): string{
    return "delete admin"
  }
}
