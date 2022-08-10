import { Injectable } from '@nestjs/common';
import { inMemoruDB } from 'src/database/in-memory-db/in-memory-db';
import { IPaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { IGroup } from '../interfaces/group.interface';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class InMemoryGroupsRepository implements GroupsRepository {
  private groups: IGroup[] = inMemoruDB.groups;

  private userGroup: string[][] = inMemoruDB.userGroup;

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

      this.deleteRelationsFromUserGroup(id);

      resolve();
    });

  private addOneUserToGroup = async (
    groupId: string,
    userId: string,
  ): Promise<string[] | void> =>
    new Promise((resolve) => {
      const item: string[] = this.userGroup.find(
        (item) => item[0] === userId && item[1] === groupId,
      );

      if (!item) {
        resolve([userId, groupId]);
      } else {
        resolve();
      }
    });

  private deleteRelationsFromUserGroup = (groupId: string) => {
    this.userGroup = this.userGroup.filter((item) => item[1] !== groupId);
  };

  addUsersToGroup = async (
    groupId: string,
    userIds: string[],
  ): Promise<void> => {
    const results = await Promise.all(
      userIds.map((userId) => this.addOneUserToGroup(groupId, userId)),
    );

    results.forEach((result) => {
      if (result) this.userGroup.push(result);
    });
  };
}
