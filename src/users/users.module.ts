import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TasksModule } from '../tasks/tasks.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
