import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
