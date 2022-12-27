import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { JobData } from 'shared-models/job-data.model';
import { Queues } from 'shared-models/queues.enum';
import { ItemDto } from '../../models/item.dto';

@Injectable()
export class AsyncService {
  constructor(
    @InjectQueue(Queues.ARITHMETIC_OPERATIONS)
    private readonly arithmeticOperationsQueue: Queue,
  ) {}

  async putItem(body: ItemDto) {
    await this.arithmeticOperationsQueue.add(
      Queues.ARITHMETIC_OPERATIONS,
      new JobData(body),
    );
    return;
  }
}
