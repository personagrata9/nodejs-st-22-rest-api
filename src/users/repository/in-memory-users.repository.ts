import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUser } from '../interfaces/user.interface';
import { IPaginatedItemsResult } from '../../common/interfaces/paginated-items-result.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { inMemoruDB } from 'src/database/in-memory-db/in-memory-db';
import { NotUniqueError } from 'src/common/errors/not-unique.error';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private users: IUser[] = inMemoruDB.users;

  findOneById = async (id: string): Promise<IUser | null> =>
    new Promise((resolve) => {
      const user: IUser = this.users.find((user) => user.id === id);
      resolve(user);
    });

  findAll = async (
    limit: number,
    offset: number,
    loginSubstring?: string,
  ): Promise<IPaginatedItemsResult<IUser>> =>
    new Promise((resolve) => {
      const existingUsers: IUser[] = this.users.filter(
        (user) => !user.isDeleted,
      );

      const filteredByLoginSubstringUsers: IUser[] = loginSubstring
        ? existingUsers.filter((user) =>
            user.login.toLowerCase().includes(loginSubstring.toLowerCase()),
          )
        : existingUsers;

      const items: IUser[] = filteredByLoginSubstringUsers
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(offset, limit + offset);

      resolve({
        items,
        limit,
        offset,
        count: filteredByLoginSubstringUsers.length,
      });
    });

  private createUserId = async (): Promise<string> => {
    const id: string = uuidv4();

    const user: IUser = await this.findOneById(id);
    if (user) await this.createUserId();

    return id;
  };

  private ckeckLoginUnique = async (
    login: string,
    id?: string,
  ): Promise<boolean> =>
    new Promise((resolve) => {
      const usersLogins: string[] = this.users
        .filter((user) => user.id !== id)
        .map((user) => user.login);

      resolve(!usersLogins.includes(login));
    });

  create = async (createUserDto: CreateUserDto): Promise<IUser> => {
    const { login } = createUserDto;
    const isLoginUnique: boolean = await this.ckeckLoginUnique(login);

    const id: string = await this.createUserId();

    return new Promise((resolve, reject) => {
      if (isLoginUnique) {
        const newUser: IUser = {
          id,
          ...createUserDto,
          isDeleted: false,
        };
        this.users.push(newUser);

        resolve(newUser);
      } else {
        reject(new NotUniqueError('user', 'login', login));
      }
    });
  };

  update = async (
    user: IUser,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> => {
    const { id } = user;
    const { login } = updateUserDto;
    const isLoginUnique: boolean = await this.ckeckLoginUnique(login, id);

    return new Promise((resolve, reject) => {
      if (isLoginUnique) {
        const updatedUser: IUser = {
          id,
          ...updateUserDto,
          isDeleted: false,
        };

        const userIndex: number = this.users.findIndex(
          (user) => user.id === id,
        );
        this.users.splice(userIndex, 1, updatedUser);

        resolve(updatedUser);
      } else {
        reject(new NotUniqueError('user', 'login', login));
      }
    });
  };

  delete = async (user: IUser): Promise<void> =>
    new Promise((resolve) => {
      const userIndex: number = this.users.findIndex(
        (user) => user.id === user.id,
      );
      this.users.splice(userIndex, 1, { ...user, isDeleted: true });

      resolve();
    });
}
