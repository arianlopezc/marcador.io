import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { ItemToStore } from 'shared-models/item-to-store.model';
import { JobData } from 'shared-models/job-data.model';
import { JobPriority } from 'shared-models/job-priority.enum';
import { Queues } from 'shared-models/queues.enum';
import { ItemsCacheRepository } from 'shared-modules/cache-repositories/items-cache-repository/items-cache-repository.service';
import { ItemsRepository } from 'shared-modules/mongo-datastore/items-repository/items-repository.service';
import { ItemDto } from '../../models/item.dto';
import { Utils } from '../utils';

@Injectable()
export class AsyncService {
  constructor(
    @InjectQueue(Queues.ARITHMETIC_OPERATIONS)
    private readonly arithmeticOperationsQueue: Queue,
    private readonly itemsCacheRepository: ItemsCacheRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async putItem(body: ItemDto): Promise<void> {
    try {
      const item = await this.getItemFromRepositories(body);
      const newItem = Utils.generateNewItemToStore(body, item);
      await this.arithmeticOperationsQueue.add(
        Queues.ARITHMETIC_OPERATIONS,
        new JobData(body, newItem),
        {
          jobId: body.id,
          priority: JobPriority.REGULAR_PRIORITY,
        },
      );
      await this.itemsCacheRepository.set(body.id, newItem);
      return;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getItem(id: string): Promise<ItemToStore> {
    try {
      return await this.getItemFromRepositories(id);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async clearFromCache(id: string): Promise<void> {
    try {
      await this.itemsCacheRepository.del(id);
      return;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private async getItemFromRepositories(itemDto: ItemDto): Promise<ItemToStore>;
  private async getItemFromRepositories(id: string): Promise<ItemToStore>;
  private async getItemFromRepositories(arg: any): Promise<ItemToStore> {
    let item: ItemToStore =
      typeof arg === 'string'
        ? await this.itemsCacheRepository.get(arg)
        : await this.itemsCacheRepository.get(arg.id);
    if (typeof item !== 'undefined' && item !== null) {
      return item;
    } else {
      const doc = await this.itemsRepository.findOne(
        Utils.generateWhereClause(arg).where,
      );
      if (doc !== undefined && doc !== null) {
        item = new ItemToStore(doc.itemId, doc.total, doc.appliedOn);
        await this.itemsCacheRepository.set(doc.itemId, item);
      }
    }
    return item;
  }
}
