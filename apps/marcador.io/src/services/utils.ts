import { DateTime } from 'luxon';
import { ItemToStore } from 'shared-models/item-to-store.model';
import { Operation } from 'shared-models/operation.enum';
import { QueryClause } from '../../../../shared-modules/mongo-datastore/schemas/query-clause.model';
import { ItemDto } from '../models/item.dto';

export class Utils {
  public static generateWhereClause(itemDto: ItemDto): QueryClause;
  public static generateWhereClause(id: string): QueryClause;
  public static generateWhereClause(arg: any): QueryClause {
    if (typeof arg === 'string') {
      return {
        where: {
          $and: [{ itemId: arg }],
        },
      };
    } else {
      const update: any = {};
      if (arg.operation === Operation.Add) {
        update['$inc'] = { total: arg.total };
      } else if (arg.operation === Operation.Subtract) {
        update['$inc'] = { total: arg.total * -1 };
      } else if (arg.operation === Operation.Set) {
        update['$set'] = { total: arg.total };
      } else {
        update['$set'] = { total: 0 };
      }
      return {
        where: {
          $and: [{ itemId: arg.id }],
        },
      };
    }
  }

  public static generateNewItemToStore(
    itemDto: ItemDto,
    currentStoredItem: ItemToStore,
  ): ItemToStore {
    let total =
      currentStoredItem !== undefined && currentStoredItem !== null
        ? currentStoredItem.total
        : 0;
    if (itemDto.operation === Operation.Add) {
      total += itemDto.total;
    } else if (itemDto.operation === Operation.Subtract) {
      total -= itemDto.total;
    } else if (itemDto.operation === Operation.Set) {
      total = itemDto.total;
    }
    return new ItemToStore(itemDto.id, total, DateTime.now().toMillis());
  }
}
