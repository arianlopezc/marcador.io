import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { ItemsRepository } from './items-repository/items-repository.service';

const modelSchemas = MongooseModule.forFeature([
  { name: Item.name, schema: ItemSchema },
]);

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://mongo:27017/marcadorio`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoCreate: true,
      autoIndex: true,
      maxPoolSize: 100,
      minPoolSize: 10,
      retryAttempts: 5,
      connectTimeoutMS: 5000,
      waitQueueTimeoutMS: 5000,
      retryWrites: true,
      retryDelay: 100,
    }),
    modelSchemas,
  ],
  providers: [ItemsRepository],
  exports: [ItemsRepository],
})
export class MongoDatastoreModule {}
