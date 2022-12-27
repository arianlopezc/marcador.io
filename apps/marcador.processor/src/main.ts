import { NestFactory } from '@nestjs/core';
import { MarcadorProcessorModule } from './marcador.processor.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(MarcadorProcessorModule);
}
bootstrap();
