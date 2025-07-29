import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomAdmin } from 'src/room-admin/entities/room-admin.entity';
import { CreateRoomAdminDto } from './dto/create-room-admin.dto';
import { UpdateRoomAdminDto } from './dto/update-room-admin.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomAdminService {
  constructor(
    @InjectRepository(RoomAdmin) private roomAdminRepository: Repository<RoomAdmin>,
    private readonly userService: UserService,
  ) {}

  async create(createRoomAdminDto: CreateRoomAdminDto): Promise<RoomAdmin> {
    try {
      const createdUser = await this.userService.createUser(createRoomAdminDto.user);
      const roomAdmin = this.roomAdminRepository.create({
        ...createRoomAdminDto.roomAdmin,
        userID: createdUser.userID,
      });
      return await this.roomAdminRepository.save(roomAdmin);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create room admin');
    }
  }

  async findAll(): Promise<RoomAdmin[]> {
    try {
      return await this.roomAdminRepository.find({
        relations: ['user', 'room'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch room admins');
    }
  }

  async findOne(id: string): Promise<RoomAdmin | null> {
    try {
      return await this.roomAdminRepository.findOne({ 
        where: { roomAdminID: id },
        relations: ['user', 'room'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch room admin');
    }
  }

  async findByUserId(userId: string): Promise<RoomAdmin | null> {
    try {
      return await this.roomAdminRepository.findOne({ 
        where: { userID: userId },
        relations: ['user', 'room'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch room admin by userID');
    }
  }

  async update(id: string, updateRoomAdminDto: UpdateRoomAdminDto): Promise<RoomAdmin> {
    try {
      const roomAdmin = await this.roomAdminRepository.findOne({ 
        where: { roomAdminID: id },
        relations: ['user', 'room'],
      });
      if (!roomAdmin) {
        throw new NotFoundException(`RoomAdmin with ID ${id} not found`);
      }
      const updatedRoomAdmin = this.roomAdminRepository.merge(roomAdmin, updateRoomAdminDto);
      return await this.roomAdminRepository.save(updatedRoomAdmin);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update room admin');
    }
  }

  remove(id: string): string {
    return "delete room admin";
  }
}
