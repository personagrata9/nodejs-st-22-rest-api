import { Inject, Injectable } from '@nestjs/common';
import { GroupsRepository } from '../repository/groups.repository';
import { IPaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
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
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> => this.groupsRepository.update(id, updateGroupDto);

  delete = async (id: string): Promise<void> =>
    this.groupsRepository.delete(id);
}
