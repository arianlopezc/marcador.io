import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../schemas/item.schema';

@Injectable()
export class ItemsRepository {
  constructor(
    @InjectModel(Item.name)
    private readonly clientModel: Model<Item>,
  ) {}

  async findOneAndUpdate(where: any, update: any): Promise<Item> {
    const doc = await this.clientModel.findOneAndUpdate<Item>(where, update, {
      maxTimeMS: 5000,
      runValidators: true,
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false,
      w: 'majority',
      wtimeout: 5000,
    });
    return doc as Item;
  }

  async findOne(where: any): Promise<Item> {
    const doc = await this.clientModel.findOne<Item>(where, undefined, {
      maxTimeMS: 5000,
      runValidators: true,
      new: false,
      upsert: false,
      setDefaultsOnInsert: false,
      useFindAndModify: false,
    });
    return doc as Item;
  }
}
