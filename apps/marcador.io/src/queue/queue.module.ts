import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Queues } from '../../../../shared-models/queues.enum';

const queues = [
  BullModule.registerQueue({
    name: Queues.ARITHMETIC_OPERATIONS,
    prefix: Queues.ARITHMETIC_OPERATIONS,
  }),
];

@Module({
  imports: [
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
    ...queues,
  ],
  exports: [...queues],
})
export class QueueModule {}
