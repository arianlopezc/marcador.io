import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ItemToStore } from 'shared-models/item-to-store.model';

@Injectable()
export class ItemsCacheRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<ItemToStore> {
    return await this.cacheManager.get<ItemToStore>(`item:${key}`);
  }

  async set(key: string, value: ItemToStore): Promise<void> {
    await this.cacheManager.set(`item:${key}`, value);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(`item:${key}`);
  }
}
