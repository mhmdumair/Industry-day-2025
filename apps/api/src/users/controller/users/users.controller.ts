import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dto/createUser.dto';
import { UsersService } from '../../service/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.fetchUsers();
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDto) {
    return this.usersService.createUser(createUserDTO);
  }
}
