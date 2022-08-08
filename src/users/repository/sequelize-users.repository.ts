import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { IPaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SequelizeUsersRepository implements UsersRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findOneById = async (id: string): Promise<IUser | undefined> => {
    try {
      const user: User = await this.userModel.findOne({
        where: { id },
      });

      return user.toJSON();
    } catch {}
  };

  findAll = async (
    limit: number,
    offset: number,
    loginSubstring?: string,
  ): Promise<IPaginatedItemsResult<IUser>> => {
    const whereOptions = loginSubstring
      ? { isDeleted: false, login: { [Op.iLike]: `%${loginSubstring}%` } }
      : { isDeleted: false };

    const { count, rows } = await this.userModel.findAndCountAll({
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

  create = async (createUserDto: CreateUserDto): Promise<IUser> => {
    try {
      const newUser: User = await this.userModel.create({
        ...createUserDto,
        isDeleted: false,
      });

      return newUser.toJSON();
    } catch (error) {
      const message: string =
        error.name === 'SequelizeUniqueConstraintError'
          ? `user with login ${createUserDto.login} already exists, please choose another login`
          : error.message;

      throw new Error(message);
    }
  };

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<IUser> => {
    try {
      const user: User = await this.userModel.findOne({ where: { id } });
      const updatedUser: User = await user.update({ ...updateUserDto });

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
    const user: User = await this.userModel.findOne({ where: { id } });
    await user.update({ isDeleted: true });
  };
}
