import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications')
    private readonly notificationsQueue: Queue,
  ) {}

  async sendTaskCreatedNotification(taskId: number, userId: number) {
    return this.notificationsQueue.add('task-created', {
      taskId,
      userId,
    });
  }

  
}
