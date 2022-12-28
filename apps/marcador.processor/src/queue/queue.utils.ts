import { ItemToStore } from 'shared-models/item-to-store.model';
import { JobData } from 'shared-models/job-data.model';
import { Item } from 'shared-modules/mongo-datastore/schemas/item.schema';
import { UpdateClause } from 'shared-modules/mongo-datastore/schemas/update-clause.model';
import { QueryClause } from '../../../../shared-modules/mongo-datastore/schemas/query-clause.model';

export class QueueUtils {
  public static generateClause(payload: JobData): QueryClause {
    return {
      where: {
        $and: [{ itemId: payload.itemDto.id }],
      },
    };
  }

  public static generateUpdate(payload: JobData): UpdateClause;
  public static generateUpdate(itemToStore: ItemToStore): UpdateClause;
  public static generateUpdate(arg: any): UpdateClause {
    const data =
      arg instanceof JobData
        ? {
            total: arg.itemToStore.total,
            appliedOn: arg.itemToStore.appliedOn,
          }
        : { total: arg.total, appliedOn: arg.appliedOn };
    const update: any = {
      $set: {
        total: data.total,
        appliedOn: data.appliedOn,
      },
    };
    return {
      update,
    };
  }

  public static generateItemToStoreItemDocument(doc?: Item): ItemToStore {
    return typeof doc !== undefined && doc !== null
      ? new ItemToStore(doc.itemId, doc.total, doc.appliedOn)
      : undefined;
  }
}
