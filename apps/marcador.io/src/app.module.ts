import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheDatastoreModule } from 'shared-modules/cache-repositories/cache-datastore.module';
import { MongoDatastoreModule } from 'shared-modules/mongo-datastore/mongo-datastore.module';
import { AsyncItemsController } from './controllers/async-items/async-items.controller';
import { SyncItemsController } from './controllers/sync-items/sync-items.controller';
import { QueueModule } from './queue/queue.module';
import { AsyncService } from './services/async/async.service';
import { SyncService } from './services/sync/sync.service';

@Module({
  controllers: [AsyncItemsController, SyncItemsController],
  imports: [
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    QueueModule,
    MongoDatastoreModule,
    CacheDatastoreModule,
  ],
  providers: [AsyncService, SyncService],
})
export class AppModule {}
