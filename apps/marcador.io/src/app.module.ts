import { Module } from '@nestjs/common';
import { AsyncItemsController } from './controllers/async-items/async-items.controller';
import { SyncItemsController } from './controllers/sync-items/sync-items.controller';

@Module({
  controllers: [AsyncItemsController, SyncItemsController],
})
export class AppModule {}
