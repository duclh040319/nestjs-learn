import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
    async process(job: Job<{taskId: number; userId: number}>): Promise<void> {
        switch (job.name) {
            case 'task-created':
                await this.handleTaskCreated(job)
                break;
        }
    }

    private async handleTaskCreated(job: Job<{taskId: number; userId: number}>) : Promise<void> {
        const {taskId, userId} = job.data

        if(job.data.taskId === -1) {
            throw new Error('Simulated notification failure')
        }

        console.log(`[Notification] Task ${taskId} was created for user ${userId}`);
        
    }
}