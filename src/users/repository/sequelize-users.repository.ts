import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { NotUniqueError } from 'src/common/errors/not-unique.error';

@Injectable()
export class SequelizeUsersRepository implements UsersRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findOneById = async (id: string): Promise<IUser | null> => {
    const user: User = await this.userModel.findOne({
      where: { id },
    });

    return user ? user.toJSON() : null;
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
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new NotUniqueError('user', 'login', createUserDto.login);
      } else {
        throw error;
      }
    }
  };

  update = async (
    user: IUser,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> => {
    try {
      const updatedUser: User = (
        await this.userModel.update(updateUserDto, {
          where: { id: user.id },
          returning: true,
        })
      )[1][0];

      return updatedUser.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new NotUniqueError('user', 'login', updateUserDto.login);
      } else {
        throw error;
      }
    }
  };

  delete = async (user: IUser): Promise<void> => {
    await this.userModel.update(
      { isDeleted: true },
      {
        where: { id: user.id },
      },
    );
  };
}
