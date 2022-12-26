import { Module } from '@nestjs/common';
import { MarcadorProcessorController } from './marcador-processor.controller';
import { MarcadorProcessorService } from './marcador-processor.service';

@Module({
  imports: [],
  controllers: [MarcadorProcessorController],
  providers: [MarcadorProcessorService],
})
export class MarcadorProcessorModule {}
