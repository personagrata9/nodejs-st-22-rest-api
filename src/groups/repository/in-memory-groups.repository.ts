import { Injectable } from '@nestjs/common';
import { inMemoryDB } from 'src/database/in-memory-db/in-memory-db';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { IGroup } from '../interfaces/group.interface';
import { GroupsRepository } from './groups.repository';
import { NotUniqueError } from 'src/common/errors/not-unique.error';

@Injectable()
export class InMemoryGroupsRepository implements GroupsRepository {
  private groups: IGroup[] = inMemoryDB.groups;
  private userGroup: string[][] = inMemoryDB.userGroup;

  findOneById = async (id: string): Promise<IGroup | null> =>
    new Promise((resolve) => {
      const group: IGroup = this.groups.find((group) => group.id === id);
      resolve(group || null);
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

  private ckeckNameUnique = async (
    name: string,
    id?: string,
  ): Promise<boolean> =>
    new Promise((resolve) => {
      const groupsNames: string[] = this.groups
        .filter((group) => group.id !== id)
        .map((group) => group.name);

      resolve(!groupsNames.includes(name));
    });

  create = async (createGroupDto: CreateGroupDto): Promise<IGroup> => {
    const { name } = createGroupDto;
    const isNameUnique: boolean = await this.ckeckNameUnique(name);

    const id: string = await this.createGroupId();

    return new Promise((resolve, reject) => {
      if (isNameUnique) {
        const newGroup: IGroup = {
          id,
          ...createGroupDto,
        };
        this.groups.push(newGroup);

        resolve(newGroup);
      } else {
        reject(new NotUniqueError('group', 'name', name));
      }
    });
  };

  update = async (
    group: IGroup,
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> => {
    const { id } = group;
    const { name } = updateGroupDto;
    const isNameUnique: boolean = await this.ckeckNameUnique(name, id);

    return new Promise((resolve, reject) => {
      if (isNameUnique) {
        const updatedGroup: IGroup = {
          ...group,
          ...updateGroupDto,
        };

        const groupIndex: number = this.groups.findIndex(
          (group) => group.id === id,
        );
        this.groups.splice(groupIndex, 1, updatedGroup);

        resolve(updatedGroup);
      } else {
        reject(new NotUniqueError('group', 'name', name));
      }
    });
  };

  delete = async (group: IGroup): Promise<void> =>
    new Promise((resolve) => {
      const groupIndex: number = this.groups.findIndex(
        (group) => group.id === group.id,
      );
      this.groups.splice(groupIndex, 1);

      this.deleteRelationsFromUserGroup(group.id);

      resolve();
    });

  private addOneUserToGroup = async (
    groupId: string,
    userId: string,
  ): Promise<string[] | void> =>
    new Promise((resolve) => {
      const existingItem: string[] = this.userGroup.find(
        (item) => item[0] === userId && item[1] === groupId,
      );

      const itemToAdd = !existingItem ? [userId, groupId] : null;

      resolve(itemToAdd);
    });

  private deleteRelationsFromUserGroup = (groupId: string) => {
    this.userGroup = this.userGroup.filter((item) => item[1] !== groupId);
  };

  addUsersToGroup = async (group: IGroup, userIds: string[]): Promise<void> => {
    const results = await Promise.all(
      userIds.map((userId) => this.addOneUserToGroup(group.id, userId)),
    );

    results.forEach((result) => {
      if (result) this.userGroup.push(result);
    });
  };
}
