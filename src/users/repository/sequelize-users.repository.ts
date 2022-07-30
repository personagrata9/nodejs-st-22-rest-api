import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserModel } from '../models/user.model';
import { User } from '../interfaces/user.interface';
import { PaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class SequelizeUsersRepository implements UsersRepository {
  findOneById = async (id: string): Promise<User | undefined> => {
    try {
      const user: UserModel = await UserModel.findOne({
        where: { id },
      });

      return user.toJSON();
    } catch {}
  };

  findAll = async (
    limit: number,
    offset: number,
    loginSubstring?: string,
  ): Promise<PaginatedItemsResult<User>> => {
    const whereOptions = loginSubstring
      ? { isDeleted: false, login: { [Op.iLike]: `%${loginSubstring}%` } }
      : { isDeleted: false };

    const { count, rows } = await UserModel.findAndCountAll({
      where: whereOptions,
      limit,
      offset,
      order: ['login'],
    });

    return {
      items: rows.map((row) => row.toJSON()),
      limit,
      offset,
      count,
    };
  };

  create = async (createUserDto: CreateUserDto): Promise<User> => {
    try {
      const newUser: UserModel = await UserModel.create({ ...createUserDto });

      return newUser.toJSON();
    } catch (error) {
      const message: string =
        error.name === 'SequelizeUniqueConstraintError'
          ? `user with login ${createUserDto.login} already exists, please choose another login`
          : error.message;

      throw new Error(message);
    }
  };

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<User> => {
    try {
      const user: UserModel = await UserModel.findOne({ where: { id } });
      const updatedUser: UserModel = await user.update({ ...updateUserDto });
      await user.save();

      return updatedUser.toJSON();
    } catch (error) {
      const message: string =
        error.name === 'SequelizeUniqueConstraintError'
          ? `user with login ${updateUserDto.login} already exists, please choose another login`
          : error.message;

      throw new Error(message);
    }
  };

  delete = async (id: string): Promise<void> => {
    const user: UserModel = await UserModel.findOne({ where: { id } });
    await user.update({ isDeleted: true });
    await user.save();
  };
}
