import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import { ItemToStore } from 'shared-models/item-to-store.model';

@Injectable()
export class ItemsCacheRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<ItemToStore> {
    const cached: ItemToStore = await this.cacheManager.get<ItemToStore>(
      `item:${key}`,
    );
    return cached !== undefined && cached !== null
      ? new ItemToStore(
          cached.itemId,
          cached.total,
          typeof cached.appliedOn === 'string'
            ? DateTime.fromISO(cached.appliedOn)
            : cached.appliedOn,
        )
      : undefined;
  }

  async set(key: string, value: ItemToStore): Promise<void> {
    await this.cacheManager.set(`item:${key}`, value);
  }
}
