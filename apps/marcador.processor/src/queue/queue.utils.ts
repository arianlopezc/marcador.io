import { JobData } from 'shared-models/job-data.model';
import { Operation } from 'shared-models/operation.enum';
import { QueryClause } from '../mongo-datastore/schemas/query-clause.model';

export class QueueUtils {
  public static createWhereClauseForImport(payload: JobData): QueryClause {
    const update: any = {};
    if (payload.itemDto.operation === Operation.Add) {
      update['$inc'] = { total: payload.itemDto.total };
    } else if (payload.itemDto.operation === Operation.Subtract) {
      update['$inc'] = { total: payload.itemDto.total * -1 };
    } else if (payload.itemDto.operation === Operation.Set) {
      update['$set']['total'] = payload.itemDto.total;
    } else {
      update['$set']['total'] = 0;
    }
    return {
      where: {
        $and: [{ itemId: payload.itemDto.id }],
      },
      update,
    };
  }
}
