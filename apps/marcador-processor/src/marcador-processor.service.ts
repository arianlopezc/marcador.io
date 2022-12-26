import { Injectable } from '@nestjs/common';

@Injectable()
export class MarcadorProcessorService {
  getHello(): string {
    return 'Hello World!';
  }
}
