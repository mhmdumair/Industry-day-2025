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
    const queryRunner = this.roomAdminRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdUser = await this.userService.createUserTransactional(
        createRoomAdminDto.user,
        queryRunner.manager
      );

      const roomAdmin = queryRunner.manager.create(RoomAdmin, {
        ...createRoomAdminDto.roomAdmin,
        userID: createdUser.userID,
      });

      const savedRoomAdmin = await queryRunner.manager.save(RoomAdmin, roomAdmin);
      
      await queryRunner.commitTransaction();
      return savedRoomAdmin;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create room admin: ${error.message}`
      );
    } finally {
      await queryRunner.release();
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
    const roomAdmin = await this.roomAdminRepository.findOne({ 
      where: { userID: userId },
      relations: ['user', 'room'],
    });
    return roomAdmin;
  } catch (error) {
      throw new InternalServerErrorException('Failed to fetch room admin by userID');
    }
  }

  async findByRoomId(roomId: string): Promise<RoomAdmin[]> {
    try {
      return await this.roomAdminRepository.find({ 
        where: { roomID: roomId },
        relations: ['user', 'room'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch room admins by roomID');
    }
  }

  async update(id: string, updateRoomAdminDto: UpdateRoomAdminDto): Promise<RoomAdmin> {
  const queryRunner = this.roomAdminRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const roomAdmin = await queryRunner.manager.findOne(RoomAdmin, {
      where: { roomAdminID: id },
      relations: ['user', 'room'],
    });

    if (!roomAdmin) {
      throw new NotFoundException(`RoomAdmin with ID ${id} not found`);
    }

    const { user: userDto, ...roomAdminFields } = updateRoomAdminDto;
    
    Object.assign(roomAdmin, roomAdminFields);

    if (userDto) {
      await this.userService.updateUserInTransaction(
        roomAdmin.userID,
        userDto,
        queryRunner.manager
      );
    }

    await queryRunner.manager.save(RoomAdmin, roomAdmin);

    await queryRunner.commitTransaction();

    const updatedRoomAdmin = await this.roomAdminRepository.findOne({
      where: { roomAdminID: id },
      relations: ['user', 'room'],
    });

    if (!updatedRoomAdmin) {
      throw new NotFoundException(`RoomAdmin with ID ${id} not found after update`);
    }

    return updatedRoomAdmin;

  } catch (error) {
    await queryRunner.rollbackTransaction();
    
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(`Failed to update room admin: ${error.message}`);
  } finally {
    await queryRunner.release();
  }
}

  async remove(id: string): Promise<{ message: string }> {
    try {
      const roomAdmin = await this.roomAdminRepository.findOne({ 
        where: { roomAdminID: id } 
      });
      if (!roomAdmin) {
        throw new NotFoundException(`RoomAdmin with ID ${id} not found`);
      }
      const userId = roomAdmin.userID;
      await this.roomAdminRepository.remove(roomAdmin);
      await this.userService.removeUser(userId);
      return { message: `RoomAdmin ${id} removed successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove room admin');
    }
  }

  async removeByRoomId(roomId: string): Promise<{ message: string; count: number }> {
    try {
      const roomAdmins = await this.roomAdminRepository.find({ 
        where: { roomID: roomId } 
      });
      if (roomAdmins.length === 0) {
        return { message: `No room admins found for room ${roomId}`, count: 0 };
      }
      await this.roomAdminRepository.remove(roomAdmins);
      return { 
        message: `All room admins for room ${roomId} removed successfully`, 
        count: roomAdmins.length 
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove room admins by roomID');
    }
  }

  async removeByUserId(userId: string): Promise<{ message: string }> {
    try {
      const roomAdmin = await this.roomAdminRepository.findOne({ 
        where: { userID: userId } 
      });
      if (!roomAdmin) {
        throw new NotFoundException(`RoomAdmin for user ${userId} not found`);
      }
      await this.roomAdminRepository.remove(roomAdmin);
      return { message: `RoomAdmin for user ${userId} removed successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove room admin by userID');
    }
  }
}