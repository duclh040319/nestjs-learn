import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { UsersService } from '../users/users.service.js';



describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    findAndCount: vi.fn(),
    findOneBy: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    remove: vi.fn()
  }

  const mockUsersService = {
    findOne: vi.fn()
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, {
        provide: getRepositoryToken(Task), useValue: mockTaskRepository
      }, {
        provide: UsersService,
        useValue: mockUsersService
      }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
