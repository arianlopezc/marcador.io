import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ItemDto } from '../../models/item.dto';
import { AsyncService } from '../../services/async/async.service';

@Controller('item')
export class AsyncItemsController {
  constructor(private readonly asyncService: AsyncService) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putItem(@Body() body: ItemDto) {
    await this.asyncService.putItem(body);
  }
}
