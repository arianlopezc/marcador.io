import { Process, Processor } from '@nestjs/bull';
import { ItemsRepository } from 'shared-modules/mongo-datastore/items-repository/items-repository.service';
import { Job } from 'bull';
import { JobData } from 'shared-models/job-data.model';
import { Queues } from 'shared-models/queues.enum';
import { QueueUtils } from '../../queue.utils';
import { ItemsCacheRepository } from 'shared-modules/cache-repositories/items-cache-repository/items-cache-repository.service';
import { ItemToStore } from 'shared-models/item-to-store.model';
import { QueryClause } from 'shared-modules/mongo-datastore/schemas/query-clause.model';

@Processor(Queues.ARITHMETIC_OPERATIONS)
export class ArithmeticProcessorService {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly itemsCacheRepository: ItemsCacheRepository,
  ) {}

  @Process(Queues.ARITHMETIC_OPERATIONS)
  async processItemArchive(job: Job<JobData>) {
    const storedItemInstances = [job.data.itemToStore];
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
}
