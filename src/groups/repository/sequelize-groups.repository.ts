import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IPaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { IGroup } from '../interfaces/group.interface';
import { Group } from '../models/group.model';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class SequelizeGroupsRepository implements GroupsRepository {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Group)
    private groupModel: typeof Group,
  ) {}

  findOneById = async (id: string): Promise<IGroup | undefined> => {
    try {
      const group: Group = await this.groupModel.findOne({
        where: { id },
      });

      return group.toJSON();
    } catch {}
  };

  findAll = async (
    limit: number,
    offset: number,
  ): Promise<IPaginatedItemsResult<IGroup>> => {
    const { count, rows } = await this.groupModel.findAndCountAll({
      limit,
      offset,
      order: ['name'],
    });

    return {
      items: rows.map((row) => row.toJSON()),
      limit,
      offset,
      count,
    };
  };

  create = async (createGroupDto: CreateGroupDto): Promise<IGroup> => {
    const newGroup: Group = await this.groupModel.create({
      ...createGroupDto,
    });

    return newGroup.toJSON();
  };

  update = async (
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> => {
    const group: Group = await this.groupModel.findOne({ where: { id } });
    const updatedGroup: Group = await group.update({ ...updateGroupDto });

    return updatedGroup.toJSON();
  };

  delete = async (id: string): Promise<void> => {
    const group: Group = await this.groupModel.findOne({ where: { id } });
    await group.destroy();
  };

  addUsersToGroup = async (
    groupId: string,
    userIds: string[],
  ): Promise<void> => {
    try {
      await this.sequelize.transaction(async (t) => {
        const group: Group = await this.groupModel.findOne({
          where: { id: groupId },
          transaction: t,
        });

        await Promise.all(
          userIds.map((userId) =>
            group.$add('users', userId, { transaction: t }),
          ),
        );
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new Error(error.parent.detail);
      }

      throw error;
    }
  };
}
