import { InjectQueue, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { ItemsRepository } from 'shared-modules/mongo-datastore/items-repository/items-repository.service';
import { Job, Queue } from 'bull';
import { JobData } from 'shared-models/job-data.model';
import { Queues } from 'shared-models/queues.enum';
import { QueueUtils } from '../../queue.utils';
import { ItemsCacheRepository } from 'shared-modules/cache-repositories/items-cache-repository/items-cache-repository.service';
import { ItemToStore } from 'shared-models/item-to-store.model';
import { QueryClause } from 'shared-modules/mongo-datastore/schemas/query-clause.model';
import { Logger } from '@nestjs/common';
import { JobPriority } from 'shared-models/job-priority.enum';
import { DateTime } from 'luxon';

interface WaitTime {
  totalCalls: number;
  waitTimes: number[];
  maxWaitTime: number;
  minWaitTime: number;
}

@Processor(Queues.ARITHMETIC_OPERATIONS)
export class ArithmeticProcessorService {
  private readonly timeRange = new Map<string, WaitTime>();

  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly itemsCacheRepository: ItemsCacheRepository,
    @InjectQueue(Queues.ARITHMETIC_OPERATIONS)
    private readonly arithmeticOperationsQueue: Queue,
  ) {}

  @Process(Queues.ARITHMETIC_OPERATIONS)
  async processItemArchive(job: Job<JobData>) {
    const storedItemInstances = [job.data.itemToStore];
    this.handleWaitTime(job);
    const storedCachedItem = await this.itemsCacheRepository.get(
      job.data.itemDto.id,
    );
    if (storedCachedItem !== undefined && storedCachedItem !== null) {
      storedItemInstances.push(storedCachedItem);
    }
    const queryClause = QueueUtils.generateClause(job.data);
    const storedItem = QueueUtils.generateItemToStoreItemDocument(
      await this.itemsRepository.findOne(queryClause.where),
    );
    if (storedItem !== undefined && storedItem !== null) {
      storedItemInstances.push(storedItem);
    }
    const mostUpdated = storedItemInstances.reduce((prev, curr) =>
      prev.appliedOn > curr.appliedOn ? prev : curr,
    );
    await Promise.all([
      this.storeInMongoIfNeeded(mostUpdated, storedItem, queryClause),
      this.storeInRedisIfNeeded(mostUpdated, storedCachedItem),
    ]);
    return;
  }

  private handleWaitTime(job: Job<JobData>) {
    const waitedToStart = DateTime.now().diff(
      DateTime.fromMillis(job.timestamp),
      'milliseconds',
    ).milliseconds;
    const now = DateTime.now();
    const timeKey = `${now.hour}:${now.minute}:${now.second}`;
    const value: WaitTime = this.timeRange.get(timeKey);
    if (typeof value === 'undefined') {
      for (const [key, range] of this.timeRange) {
        if (key !== timeKey) {
          Logger.log(
            `Min wait time: ${range.minWaitTime} ms, Max wait time: ${
              range.maxWaitTime
            } ms, Avg wait time: ${Math.round(
              range.waitTimes.reduce((prev, curr) => prev + curr) /
                range.waitTimes.length,
            )} ms, Total calls: ${range.totalCalls}`,
          );
        }
      }
      this.timeRange.clear();
      this.timeRange.set(timeKey, {
        waitTimes: [waitedToStart],
        minWaitTime: waitedToStart,
        maxWaitTime: waitedToStart,
        totalCalls: 1,
      });
    } else {
      value.totalCalls++;
      value.waitTimes.push(waitedToStart);
      value.maxWaitTime = Math.max(value.maxWaitTime, waitedToStart);
      value.minWaitTime = Math.min(value.minWaitTime, waitedToStart);
      this.timeRange.set(timeKey, value);
    }
  }

  private async storeInMongoIfNeeded(
    mostUpdated: ItemToStore,
    storedItem: ItemToStore,
    queryClause: QueryClause,
  ) {
    if (
      storedItem === undefined ||
      storedItem === null ||
      storedItem.appliedOn < mostUpdated.appliedOn
    ) {
      await this.itemsRepository.findOneAndUpdate(
        queryClause.where,
        QueueUtils.generateUpdate(mostUpdated).update,
      );
    }
  }

  private async storeInRedisIfNeeded(
    mostUpdated: ItemToStore,
    storedCachedItem: ItemToStore,
  ) {
    if (
      storedCachedItem === undefined ||
      storedCachedItem === null ||
      storedCachedItem.appliedOn < mostUpdated.appliedOn
    ) {
      await this.itemsCacheRepository.set(mostUpdated.itemId, mostUpdated);
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<JobData>, error: Error) {
    Logger.error(error);
    await this.arithmeticOperationsQueue.add(
      Queues.ARITHMETIC_OPERATIONS,
      job.data,
      {
        jobId: job.data.itemDto.id,
        priority: JobPriority.HIGH_PRIORITY,
      },
    );
  }
}
