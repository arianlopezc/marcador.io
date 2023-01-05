import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Queues } from '../../../../shared-models/queues.enum';
import { CacheDatastoreModule } from '../../../../shared-modules/cache-repositories/cache-datastore.module';
import { MongoDatastoreModule } from '../../../../shared-modules/mongo-datastore/mongo-datastore.module';
import { ArithmeticProcessorService } from './processors/arithmetic-processor/arithmetic-processor.service';

@Module({
  imports: [
    CacheDatastoreModule,
    MongoDatastoreModule,
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
      settings: {
        retryProcessDelay: 100,
        stalledInterval: 1000,
      },
      defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true,
        timeout: 5000,
      },
    }),
    BullModule.registerQueue({
      name: Queues.ARITHMETIC_OPERATIONS,
      prefix: Queues.ARITHMETIC_OPERATIONS,
    }),
  ],
  providers: [ArithmeticProcessorService],
})
export class QueueModule {}
