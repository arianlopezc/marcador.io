import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { DateTime } from 'luxon';
import { ItemToStore } from 'shared-models/item-to-store.model';
import { JobData } from 'shared-models/job-data.model';
import { Queues } from 'shared-models/queues.enum';
import { ItemsCacheRepository } from 'shared-modules/cache-repositories/items-cache-repository/items-cache-repository.service';
import { ItemsRepository } from 'shared-modules/mongo-datastore/items-repository/items-repository.service';
import { ItemDto } from '../../models/item.dto';
import { Utils } from '../utils';

@Injectable()
export class AsyncService {
  private readonly REGULAR_PRIORITY = 2;
  private readonly HIGH_PRIORITY = 1;

  constructor(
    @InjectQueue(Queues.ARITHMETIC_OPERATIONS)
    private readonly arithmeticOperationsQueue: Queue,
    private readonly itemsCacheRepository: ItemsCacheRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async putItem(body: ItemDto): Promise<void> {
    const item = await this.getItemFromRepositories(body);
    const newItem = Utils.generateNewItemToStore(body, item);
    await this.arithmeticOperationsQueue.add(
      Queues.ARITHMETIC_OPERATIONS,
      new JobData(body, newItem),
      {
        jobId: body.id,
        priority: this.REGULAR_PRIORITY,
      },
    );
    await this.itemsCacheRepository.set(body.id, newItem);
    return;
  }

  async getItem(id: string): Promise<ItemToStore> {
    return await this.getItemFromRepositories(id);
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
      console.log(Utils.generateWhereClause(arg));
      const doc = await this.itemsRepository.findOne(
        Utils.generateWhereClause(arg).where,
      );
      console.log('doc', doc);
      if (doc !== undefined && doc !== null) {
        item = new ItemToStore(
          doc.itemId,
          doc.total,
          DateTime.fromJSDate(doc.appliedOn),
        );
        await this.itemsCacheRepository.set(doc.itemId, item);
      }
    }
    return item;
  }
}
