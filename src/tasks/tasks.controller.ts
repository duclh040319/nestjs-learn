import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { QueryTaskDto } from './dto/query-task.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { type AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  
  
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() queryTaskDto: QueryTaskDto,
  ) {
    return this.tasksService.findAll(queryTaskDto, req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.findOneForUser(id, req.user.userId);
  }

  @Post('users/:userId')
  createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      createTaskDto.title,
      userId,
      createTaskDto.completed,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.updateForUser(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.tasksService.removeForUser(id, req.user.userId);

    return {
      message: 'Task deleted successfully',
    };
  }
}
