export class ItemToStore {
  constructor(
    public readonly itemId: string,
    public readonly total: number,
    public readonly appliedOn: number,
  ) {}
}
