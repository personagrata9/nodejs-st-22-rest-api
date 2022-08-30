import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupsServiceMock {
  findAll = jest.fn();

  findOneById = jest.fn();

  create = jest.fn();

  update = jest.fn();

  delete = jest.fn();

  addUsersToGroup = jest.fn();
}
