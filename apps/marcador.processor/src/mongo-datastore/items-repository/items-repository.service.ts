import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../schemas/item.schema';

@Injectable()
export class ItemsRepositoryService {
  constructor(
    @InjectModel(Item.name)
    private readonly clientModel: Model<Item>,
  ) {}

  async findOneAndUpdate(where: any, update: any): Promise<Item> {
    const doc = (await this.clientModel.findOneAndUpdate<Item>(where, update, {
      maxTimeMS: 5000,
      runValidators: true,
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false,
      w: 'majority',
      wtimeout: 5000,
    })) as Item;
    return doc;
  }
}
