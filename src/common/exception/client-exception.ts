import { BadRequestException } from '@nestjs/common';
import { ClientError } from './client-error.enum';

export class ClientException extends BadRequestException {
  constructor(type: ClientError, description?: object | string) {
    super({ type, description });
  }
}
