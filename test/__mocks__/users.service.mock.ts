import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersServiceMock {
  findAutoSuggestUsers = jest.fn();

  findOneById = jest.fn();

  findOneByLogin = jest.fn();

  create = jest.fn();

  update = jest.fn();

  delete = jest.fn();
}
