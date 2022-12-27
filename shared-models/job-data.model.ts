import { ItemDto } from 'apps/marcador.io/src/models/item.dto';

export class JobData {
  constructor(public readonly itemDto: ItemDto) {}
}
