import { NestFactory } from '@nestjs/core';
import { MarcadorProcessorModule } from './marcador-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(MarcadorProcessorModule);
  await app.listen(3000);
}
bootstrap();
