import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { CacheDatastoreModule } from '../../../shared-modules/cache-repositories/cache-datastore.module';

@Module({
  imports: [QueueModule, CacheDatastoreModule],
})
export class MarcadorProcessorModule {}
