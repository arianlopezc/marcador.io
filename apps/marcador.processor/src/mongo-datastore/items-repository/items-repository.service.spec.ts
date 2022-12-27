import { Test, TestingModule } from '@nestjs/testing';
import { ItemsRepositoryService } from './items-repository.service';

describe('ItemsRepositoryService', () => {
  let service: ItemsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsRepositoryService],
    }).compile();

    service = module.get<ItemsRepositoryService>(ItemsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
