import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from '../src/groups/controllers/groups.controller';
import { GroupsService } from '../src/groups/services/groups.service';
import { GroupsServiceMock } from './__mocks__/groups.service';
import { UsersService } from '../src/users/services/users.service';
import { UsersServiceMock } from './__mocks__/users.service.mock';
import { IGroup } from '../src/groups/interfaces/group.interface';
import { IPaginatedItemsResult } from '../src/common/interfaces/paginated-items-result.interface';
import { group } from './fixtures/group.fixture';
import { createGroupDto } from './fixtures/create-group-dto.fixture';
import { NotUniqueError } from '../src/common/errors/not-unique.error';
import { BadRequestException } from '@nestjs/common';
import { updateGroupDto } from './fixtures/update-group-dto.fixture';
import { ISuccessResponse } from 'src/common/interfaces/success-response.interface';
import { user } from './fixtures/user.fixture';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useClass: GroupsServiceMock,
        },
        {
          provide: UsersService,
          useClass: UsersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return array of groups', async () => {
    const limit = 10;
    const offset = 0;

    service.findAll.mockResolvedValue({
      items: [group],
      limit,
      offset,
      count: 1,
    });

    const result: IPaginatedItemsResult<IGroup> = await controller.getAll({
      limit,
      offset,
    });

    expect(result).toEqual({ items: [group], limit, offset, count: 1 });
    expect(service.findAll.mock.calls[0]).toMatchSnapshot();
  });

  it('should return group', async () => {
    service.findOneById.mockResolvedValue(group);

    const result: IGroup = await controller.getById(group);

    expect(result).toEqual(group);
  });

  it('should create a group', async () => {
    service.create.mockResolvedValue(group);

    const result: IGroup = await controller.create(createGroupDto);

    expect(result).toEqual(group);
  });

  it('should throw an error when creating a group with not unique name', async () => {
    service.create.mockRejectedValue(
      new NotUniqueError('group', 'name', createGroupDto.name),
    );

    try {
      await controller.create(createGroupDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `group with name ${createGroupDto.name} already exists, please choose another name`,
      );
    }
  });

  it('should add users to group', async () => {
    service.addUsersToGroup.mockResolvedValue();

    const result: ISuccessResponse = await controller.addUsersToGroup(group, {
      userIds: [user.id],
    });

    expect(result.message).toBe(
      `users were successfully added to group with id ${group.id}`,
    );
  });

  it('should update existing group', async () => {
    const updatedGroup: IGroup = { ...group, ...updateGroupDto };

    service.update.mockResolvedValue(updatedGroup);

    const result: IGroup = await controller.update(group, updateGroupDto);

    expect(result).toEqual(updatedGroup);
  });

  it('should throw an error when updating a group with not unique name', async () => {
    service.update.mockRejectedValue(
      new NotUniqueError('group', 'name', updateGroupDto.name),
    );

    try {
      await controller.update(group, updateGroupDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `group with name ${updateGroupDto.name} already exists, please choose another name`,
      );
    }
  });

  it('should delete existing group', async () => {
    const result = await controller.delete(group);
    expect(result).toBeUndefined();
  });
});
