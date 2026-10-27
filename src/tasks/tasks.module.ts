import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { UsersModule } from '../users/users.module.js';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notification.service.js';
import { NotificationsProcessor } from './notifications.processor.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, NotificationsService, NotificationsProcessor],
})
export class TasksModule {}
