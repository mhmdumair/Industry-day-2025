import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomAdmin } from 'src/typeorm/entities/user/room-admin.entity';
import { CreateRoomAdminDto } from './dto/create-room-admin.dto';
import { UpdateRoomAdminDto } from './dto/update-room-admin.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomAdminService {
  constructor(
      @InjectRepository(RoomAdmin) private roomAdminRepository: Repository<RoomAdmin>,
      private readonly userService: UserService,
  ) {}

  // we need to check room admin creation after completing room api

  async create(createRoomAdminDto: CreateRoomAdminDto): Promise<RoomAdmin> {
    const createdUser = await this.userService.createUser(createRoomAdminDto.user);
    const roomAdmin = this.roomAdminRepository.create({
      ...createRoomAdminDto.roomAdmin,
      userID: createdUser.userID,
    });
    return this.roomAdminRepository.save(roomAdmin);
  }

  async findAll(): Promise<RoomAdmin[]> {
    return this.roomAdminRepository.find();
  }

  async findOne(id: string): Promise<RoomAdmin | null> {
    return this.roomAdminRepository.findOne({ where: { roomAdminID: id } });
  }

  async findByUserId(userId: string): Promise<RoomAdmin | null> {
    return this.roomAdminRepository.findOne({ where: { userID: userId } });
  }

  async update(id: string, updateRoomAdminDto: UpdateRoomAdminDto): Promise<RoomAdmin> {
    const roomAdmin = await this.roomAdminRepository.findOne({ where: { roomAdminID: id } });
    if (!roomAdmin) {
      throw new NotFoundException(`RoomAdmin with ID ${id} not found`);
    }
    const updatedRoomAdmin = this.roomAdminRepository.merge(roomAdmin, updateRoomAdminDto);
    return this.roomAdminRepository.save(updatedRoomAdmin);
  }

  remove(id: string): string {
    return "delete room admin"
  }
}