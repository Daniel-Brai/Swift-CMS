import { BadRequestException } from '@nestjs/common';

export class AlreadyExistException<T> extends BadRequestException {
  readonly type: T;

  constructor(type: T, error?: string) {
    super(`A ${type} with the same property already exists`, error);
    this.type = type;
  }
}
