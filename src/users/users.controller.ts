import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @Post()
  create(@Body() body: { name: string }) {
    return this.usersService.create(body.name);
  }

  @Get(':id/tasks')
  findTasks(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findTasks(id);
  }
}
