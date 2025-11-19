import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async fetchUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async fetchUserById(userID: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { userID } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user by ID');
    }
  }

  async fetchUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user by email');
    }
  }

  async createUser(userDetails: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.fetchUserByEmail(userDetails.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const newUser = this.userRepository.create(userDetails);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateProfilePicture(
    userID: string,
    file: Express.Multer.File,
    oldPublicId: string | null,
  ): Promise<User> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newPublicId: string | null = null;
    let newSecureUrl: string | null = null;

    try {
      const user = await queryRunner.manager.findOne(User, { where: { userID } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userID} not found.`);
      }

      const uploadResult = await this.cloudinaryService.uploadProfilePicture(file);
      newPublicId = uploadResult.public_id;
      newSecureUrl = uploadResult.secure_url;

      user.profile_picture = newSecureUrl;
      user.profile_picture_public_id = newPublicId;

      const updatedUser = await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      if (oldPublicId) {
        await this.cloudinaryService.deleteFile(oldPublicId);
      }

      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (newPublicId) {
        console.warn(`Attempting cleanup of Cloudinary file ${newPublicId} after DB failure.`);
        try {
          await this.cloudinaryService.deleteFile(newPublicId);
        } catch (cleanupError) {
          console.error(`Failed to cleanup Cloudinary file ${newPublicId}:`, cleanupError.message);
        }
      }

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update profile picture: ${error.message}`
      );
    } finally {
      await queryRunner.release();
    }
  }

  async removeUser(userID: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { userID } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userID} not found`);
      }

      await this.userRepository.remove(user);
      return { message: `User ${userID} removed successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove user');
    }
  }

  async updateUserInTransaction(
    userId: string,
    dto: UpdateUserDto,
    entityManager: EntityManager,
): Promise<User> {
    const userRepo = entityManager.getRepository(User);
    const user = await userRepo.findOne({ where: { userID: userId } });
    if (!user) {
        throw new NotFoundException(`User ${userId} not found`);
    }
    const updatedUser = userRepo.merge(user, dto);
    return await userRepo.save(updatedUser);
}

  async createUserTransactional(
    createUserDto: CreateUserDto,
    manager: EntityManager,
  ): Promise<User> {
    try {
      const userRepo = manager.getRepository(User);
      const existingUser = await userRepo.findOne({ 
        where: { email: createUserDto.email } 
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = userRepo.create({
        ...createUserDto,
      });
      
      return await userRepo.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user (transactional)');
    }
  }
}