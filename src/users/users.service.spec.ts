import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';

const mockUserService = {
  findAll: vi.fn(),
  findOne: vi.fn(),
  register: vi.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
