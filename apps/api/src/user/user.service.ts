import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/user/user.entity';
import { CreateUserParams } from './utils/types';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async fetchUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async fetchUserById(userID: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userID } });
  }

  async fetchUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email} });
  }

  async createUser(userDetails: CreateUserDto): Promise<User> {
    const existingUser = await this.fetchUserByEmail(userDetails.email);

    if (existingUser) {
      console.log(userDetails.email);
      
      console.log(existingUser.email);
      
      throw new ConflictException('Email already exists');
    }

    const newUser = this.userRepository.create(userDetails);

    // Generate unique 6-character ID
    newUser.userID = await this.generateUniqueID();

    return this.userRepository.save(newUser);
  }

  private async generateUniqueID(): Promise<string> {
    let id: string;
    let exists: boolean;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops

    do {
      id = this.generateRandomID();
      const existingUser = await this.userRepository.findOne({
        where: { userID: id },
      });
      exists = !!existingUser;
      attempts++;

      if (attempts >= maxAttempts) {
        throw new ConflictException(
          'Unable to generate unique user ID after multiple attempts',
        );
      }
    } while (exists);

    return id;
  }

  private generateRandomID(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
