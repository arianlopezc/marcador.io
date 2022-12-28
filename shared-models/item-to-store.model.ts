import { DateTime } from 'luxon';

export class ItemToStore {
  constructor(
    public readonly itemId: string,
    public readonly total: number,
    public readonly appliedOn: DateTime,
  ) {}
}
