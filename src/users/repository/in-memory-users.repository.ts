import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private users: IUser[] = [];

  findOneById = async (id: string): Promise<IUser | undefined> =>
    new Promise((resolve) => {
      const user = this.users.find((user) => user.id === id);
      resolve(user);
    });

  findAll = async (
    limit: number,
    offset: number,
    loginSubstring?: string,
  ): Promise<PaginatedItemsResult<IUser>> =>
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

    const isUserExist = await this.findOneById(id);
    if (isUserExist) await this.createUserId();

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
        reject(
          new Error(
            `user with login ${login} already exists, please choose another login`,
          ),
        );
      }
    });
  };

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<IUser> => {
    const { login } = updateUserDto;
    const isLoginUnique: boolean = await this.ckeckLoginUnique(login, id);

    return new Promise((resolve, reject) => {
      if (isLoginUnique) {
        const updatedUser: IUser = {
          id,
          ...updateUserDto,
          isDeleted: false,
        };

        const userIndex = this.users.findIndex((user) => user.id === id);
        this.users.splice(userIndex, 1, updatedUser);

        resolve(updatedUser);
      } else {
        reject(
          new Error(
            `user with login ${login} already exists, please choose another login`,
          ),
        );
      }
    });
  };

  delete = async (id: string): Promise<void> => {
    const user = await this.findOneById(id);

    return new Promise((resolve) => {
      const userIndex = this.users.findIndex((user) => user.id === id);
      this.users.splice(userIndex, 1, { ...user, isDeleted: true });

      resolve();
    });
  };
}
