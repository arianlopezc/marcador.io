import { Test, TestingModule } from '@nestjs/testing';
import { AsyncItemsController } from './async-items.controller';

describe('AsyncItemsController', () => {
  let controller: AsyncItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsyncItemsController],
    }).compile();

    controller = module.get<AsyncItemsController>(AsyncItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
