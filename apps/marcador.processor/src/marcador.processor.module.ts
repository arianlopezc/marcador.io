import { Module } from '@nestjs/common';
import { MarcadorProcessorService } from './marcador.processor.service';
import { MongoDatastoreModule } from './mongo-datastore/mongo-datastore.module';

@Module({
  imports: [MongoDatastoreModule],
  providers: [MarcadorProcessorService],
})
export class MarcadorProcessorModule {}
