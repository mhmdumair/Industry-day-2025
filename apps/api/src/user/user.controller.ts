import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { CreateUserParams } from './utils/types';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async getUsers() {
    return this.usersService.fetchUsers();
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.createUser(createUser);
  }
}
