import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Queues } from '../../../../shared-models/queues.enum';
import { MongoDatastoreModule } from '../mongo-datastore/mongo-datastore.module';
import { ArithmeticProcessorService } from './processors/arithmetic-processor/arithmetic-processor.service';

@Module({
  imports: [
    MongoDatastoreModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      settings: {
        retryProcessDelay: 100,
        stalledInterval: 1000,
      },
      defaultJobOptions: {
        attempts: 4,
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
