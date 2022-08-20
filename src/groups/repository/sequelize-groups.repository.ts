import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { NotUniqueError } from 'src/common/errors/not-unique.error';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
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

  findOneById = async (id: string): Promise<IGroup | undefined> =>
    this.groupModel.findOne({
      where: { id },
    });

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
    try {
      const newGroup: Group = await this.groupModel.create({
        ...createGroupDto,
      });

      return newGroup;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new NotUniqueError('group', 'name', createGroupDto.name);
      } else {
        throw error;
      }
    }
  };

  update = async (
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> => {
    try {
      const updatedGroup: Group = (
        await this.groupModel.update(updateGroupDto, {
          where: { id },
          returning: true,
        })
      )[1][0];

      return updatedGroup;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new NotUniqueError('group', 'name', updateGroupDto.name);
      } else {
        throw error;
      }
    }
  };

  delete = async (id: string): Promise<void> => {
    await this.groupModel.destroy({ where: { id } });
  };

  addUsersToGroup = async (id: string, userIds: string[]): Promise<void> => {
    await this.sequelize.transaction(async (t) => {
      const groupModel: Group = await this.groupModel.findOne({
        where: { id },
        transaction: t,
      });

      await Promise.all(
        userIds.map((userId) =>
          groupModel.$add('users', userId, { transaction: t }),
        ),
      );
    });
  };
}
