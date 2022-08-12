import { Inject, Injectable } from '@nestjs/common';
import { GroupsRepository } from '../repository/groups.repository';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { IGroup } from '../interfaces/group.interface';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @Inject('GroupsRepository') private groupsRepository: GroupsRepository,
  ) {}

  findAll = async (
    limit: number,
    offset: number,
  ): Promise<IPaginatedItemsResult<IGroup>> =>
    this.groupsRepository.findAll(limit, offset);

  findOneById = async (id: string): Promise<IGroup> =>
    this.groupsRepository.findOneById(id);

  create = async (createGroupDto: CreateGroupDto): Promise<IGroup> =>
    this.groupsRepository.create(createGroupDto);

  update = async (
    group: IGroup,
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> => this.groupsRepository.update(group, updateGroupDto);

  delete = async (group: IGroup): Promise<void> =>
    this.groupsRepository.delete(group);

  addUsersToGroup = async (group: IGroup, userIds: string[]): Promise<void> =>
    this.groupsRepository.addUsersToGroup(group, userIds);
}
