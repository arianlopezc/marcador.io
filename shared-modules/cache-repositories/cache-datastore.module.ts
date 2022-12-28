import { CacheModule, Module } from '@nestjs/common';
import { ItemsCacheRepository } from './items-cache-repository/items-cache-repository.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        ttl: 900,
      }),
    }),
  ],
  providers: [ItemsCacheRepository],
  exports: [ItemsCacheRepository],
})
export class CacheDatastoreModule {}
