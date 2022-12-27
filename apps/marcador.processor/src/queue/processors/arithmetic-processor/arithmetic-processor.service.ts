import { Process, Processor } from '@nestjs/bull';
import { ItemsRepository } from 'apps/marcador.processor/src/mongo-datastore/items-repository/items-repository.service';
import { Job } from 'bull';
import { JobData } from 'shared-models/job-data.model';
import { Queues } from 'shared-models/queues.enum';
import { QueueUtils } from '../../queue.utils';

@Processor(Queues.ARITHMETIC_OPERATIONS)
export class ArithmeticProcessorService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  @Process(Queues.ARITHMETIC_OPERATIONS)
  async processItemArchive(job: Job<JobData>) {
    const clause = QueueUtils.createWhereClauseForImport(job.data);
    await this.itemsRepository.findOneAndUpdate(clause.where, clause.update);
    return;
  }
}
