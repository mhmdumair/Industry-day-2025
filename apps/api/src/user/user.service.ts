import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/user/user.entity';
import { CreateUserParams } from './utils/types';

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
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(userDetails: CreateUserParams): Promise<User> {
  const existingUser = await this.fetchUserByEmail(userDetails.email);

  if (existingUser) {
    throw new ConflictException('Email already exists');
  }
  const newUser = this.userRepository.create(userDetails);
  return this.userRepository.save(newUser);
}

}
