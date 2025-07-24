import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/user/user.entity';
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
}
