import { Injectable } from '@nestjs/common';
import { ItemDto } from '../../models/item.dto';

@Injectable()
export class SyncService {
  async putItem(body: ItemDto) {
    return;
  }
}
