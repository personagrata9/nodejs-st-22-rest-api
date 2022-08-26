import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from '../services/groups.service';
import { UsersService } from '../../users/services/users.service';
import { InMemoryGroupsRepository } from '../repository/in-memory-groups.repository';
import { InMemoryUsersRepository } from '../../users/repository/in-memory-users.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { IGroup } from '../interfaces/group.interface';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { IPaginatedItemsResult } from '../../common/interfaces/paginated-items-result.interface';
import { BadRequestException } from '@nestjs/common';

describe('GroupsController', () => {
  let controller: GroupsController;

  const createGroupData: CreateGroupDto = {
    name: 'group1',
    permissions: ['READ', 'WRITE'],
  };

  const updateGroupData: UpdateGroupDto = {
    name: 'group1_upd',
    permissions: ['READ', 'WRITE', 'DELETE'],
  };

  let mockGroup: IGroup;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        UsersService,
        {
          provide: 'GroupsRepository',
          useClass: InMemoryGroupsRepository,
        },
        {
          provide: 'UsersRepository',
          useClass: InMemoryUsersRepository,
        },
        {
          provide: AccessTokenGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return no groups', async () => {
    const groups: IPaginatedItemsResult<IGroup> = await controller.getAll({});

    expect(groups.items.length).toEqual(0);
  });

  it('should create a group', async () => {
    const savedGroup: IGroup = await controller.create(createGroupData);

    mockGroup = savedGroup;

    expect(savedGroup).toEqual({
      id: expect.any(String),
      ...createGroupData,
    });
  });

  it('should throw an error when creating a group with not unique name', async () => {
    try {
      await controller.create(createGroupData);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `group with name ${createGroupData.name} already exists, please choose another name`,
      );
    }
  });

  it('should return array with one group', async () => {
    const groups: IPaginatedItemsResult<IGroup> = await controller.getAll({});

    expect(groups.items.length).toEqual(1);

    expect(groups.items[0]).toEqual(mockGroup);
  });

  it('should update a group', async () => {
    const updatedGroup: IGroup = await controller.update(
      mockGroup,
      updateGroupData,
    );

    mockGroup = updatedGroup;

    expect(updatedGroup).toEqual({
      id: expect.any(String),
      ...updateGroupData,
    });
  });

  it('should delete a group', async () => {
    const result = await controller.delete(mockGroup);
    expect(result).toBeUndefined();

    const groups: IPaginatedItemsResult<IGroup> = await controller.getAll({});
    expect(groups.items.length).toEqual(0);
  });
});
