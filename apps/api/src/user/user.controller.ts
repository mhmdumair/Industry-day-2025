import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

   @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.usersService.fetchUserById(id);
    }
}
