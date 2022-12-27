import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ItemDto } from '../../models/item.dto';
import { SyncService } from '../../services/sync/sync.service';

@Controller('item/wait')
export class SyncItemsController {
  constructor(private readonly asyncService: SyncService) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putItem(@Body() body: ItemDto) {
    await this.asyncService.putItem(body);
  }
}
