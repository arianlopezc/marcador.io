import { Controller, Get } from '@nestjs/common';
import { MarcadorProcessorService } from './marcador-processor.service';

@Controller()
export class MarcadorProcessorController {
  constructor(private readonly marcadorProcessorService: MarcadorProcessorService) {}

  @Get()
  getHello(): string {
    return this.marcadorProcessorService.getHello();
  }
}
