import { Test, TestingModule } from '@nestjs/testing';
import { MarcadorProcessorController } from './marcador-processor.controller';
import { MarcadorProcessorService } from './marcador-processor.service';

describe('MarcadorProcessorController', () => {
  let marcadorProcessorController: MarcadorProcessorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MarcadorProcessorController],
      providers: [MarcadorProcessorService],
    }).compile();

    marcadorProcessorController = app.get<MarcadorProcessorController>(MarcadorProcessorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(marcadorProcessorController.getHello()).toBe('Hello World!');
    });
  });
});
