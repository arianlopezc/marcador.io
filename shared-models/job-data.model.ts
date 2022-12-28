import { ItemDto } from 'apps/marcador.io/src/models/item.dto';
import { ItemToStore } from './item-to-store.model';

export class JobData {
  constructor(
    public readonly itemDto: ItemDto,
    public readonly itemToStore: ItemToStore,
  ) {}
}
