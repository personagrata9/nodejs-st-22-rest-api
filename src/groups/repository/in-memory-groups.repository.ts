import { Injectable } from '@nestjs/common';
import { IPaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { IGroup } from '../interfaces/group.interface';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class InMemoryGroupsRepository implements GroupsRepository {
  private groups: IGroup[] = [];

  findOneById = async (id: string): Promise<IGroup | undefined> =>
    new Promise((resolve) => {
      const group: IGroup = this.groups.find((group) => group.id === id);
      resolve(group);
    });

  findAll = async (
    limit: number,
    offset: number,
  ): Promise<IPaginatedItemsResult<IGroup>> =>
    new Promise((resolve) => {
      const items: IGroup[] = this.groups
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(offset, limit + offset);

      resolve({
        items,
        limit,
        offset,
        count: this.groups.length,
      });
    });

  private createGroupId = async (): Promise<string> => {
    const id: string = uuidv4();

    const group: IGroup = await this.findOneById(id);
    if (group) await this.createGroupId();

    return id;
  };

  create = async (createGroupDto: CreateGroupDto): Promise<IGroup> => {
    const id: string = await this.createGroupId();

    return new Promise((resolve) => {
      const newGroup: IGroup = {
        id,
        ...createGroupDto,
      };
      this.groups.push(newGroup);

      resolve(newGroup);
    });
  };

  update = async (
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> =>
    new Promise((resolve) => {
      const updatedGroup: IGroup = {
        id,
        ...updateGroupDto,
      };

      const groupIndex: number = this.groups.findIndex(
        (group) => group.id === id,
      );
      this.groups.splice(groupIndex, 1, updatedGroup);

      resolve(updatedGroup);
    });

  delete = async (id: string): Promise<void> =>
    new Promise((resolve) => {
      const groupIndex: number = this.groups.findIndex(
        (group) => group.id === id,
      );
      this.groups.splice(groupIndex, 1);

      resolve();
    });
}
