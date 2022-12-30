import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ItemDto } from '../../models/item.dto';
import { AsyncService } from '../../services/async/async.service';
import { Response } from 'express';
import { RequestMetadataInterceptor } from '../../interceptors/request-metadata.interceptor';

@UseInterceptors(new RequestMetadataInterceptor())
@Controller('item')
export class AsyncItemsController {
  constructor(private readonly asyncService: AsyncService) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putItem(@Body() body: ItemDto) {
    await this.asyncService.putItem(body);
  }

  @Get()
  async getItem(@Query('id') id: string, @Res() res: Response) {
    const item = await this.asyncService.getItem(id);
    if (typeof item === 'undefined' || item === null) {
      res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.OK).json(item);
    }
  }
}
