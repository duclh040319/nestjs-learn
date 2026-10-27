import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

import { Task } from './entities/task.entity.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { UsersService } from '../users/users.service.js';
import { QueryTaskDto } from './dto/query-task.dto.js';
import { NotificationsService } from './notification.service.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(queryTaskDto: QueryTaskDto, currentUserId: number) {
    const {
      completed,
      sortBy = 'id',
      order = 'ASC',
      page = 1,
      limit = 10,
    } = queryTaskDto;

    const where: FindOptionsWhere<Task> = {
      user: { id: currentUserId },
    };

    if (completed !== undefined) {
      where.completed = completed;
    }

    const sortOptions: FindOptionsOrder<Task> = {
      [sortBy]: order,
    };
    const [items, total] = await this.taskRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: sortOptions,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findOneForUser(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(
    title: string,
    userId: number,
    completed: boolean = false,
  ): Promise<Task> {
    const user = await this.userService.findOne(userId);

    const task = this.taskRepository.create({
      title,
      completed,
      user,
    });
    const savedTask = await this.taskRepository.save(task);

    await this.notificationsService.sendTaskCreatedNotification(
      savedTask.id,
      user.id,
    );

    return savedTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.completed !== undefined) {
      task.completed = updateTaskDto.completed;
    }

    return this.taskRepository.save(task);
  }

  async updateForUser(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    const task = await this.findOneForUser(id, userId);

    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.taskRepository.delete(id);
  }
  async removeForUser(id: number, userId: number): Promise<void> {
    const task = await this.findOneForUser(id, userId);
    await this.taskRepository.remove(task);
  }
}
