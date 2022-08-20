import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUser } from '../interfaces/user.interface';
import { IPaginatedItemsResult } from '../../common/interfaces/paginated-items-result.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { inMemoryDB } from 'src/database/in-memory-db/in-memory-db';
import { NotUniqueError } from 'src/common/errors/not-unique.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private users: IUser[] = inMemoryDB.users;

  findOneById = async (id: string): Promise<IUser | null> =>
    new Promise((resolve) => {
      const user: IUser = this.users.find((user) => user.id === id);
      resolve(user || null);
    });

  findOneByLogin = async (login: string): Promise<IUser | null> =>
    new Promise((resolve) => {
      const user: IUser = this.users.find((user) => user.login === login);
      resolve(user || null);
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
    const id: string = await this.createUserId();
    const { login, password } = createUserDto;
    const isLoginUnique: boolean = await this.ckeckLoginUnique(login);
    const hashedPassword: string = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      if (isLoginUnique) {
        const newUser: IUser = {
          id,
          ...createUserDto,
          password: hashedPassword,
          isDeleted: false,
        };
        this.users.push(newUser);

        resolve(newUser);
      } else {
        reject(new NotUniqueError('user', 'login', login));
      }
    });
  };

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<IUser> => {
    const { login, password } = updateUserDto;
    const user: IUser = await this.findOneById(id);
    const isLoginUnique: boolean = await this.ckeckLoginUnique(login, id);
    const hashedPassword: string = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      if (isLoginUnique) {
        const updatedUser: IUser = {
          ...user,
          ...updateUserDto,
          password: hashedPassword,
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

  delete = async (id: string): Promise<void> => {
    const userIndex: number = this.users.findIndex(
      (user) => user.id === user.id,
    );
    const user: IUser = await this.findOneById(id);

    return new Promise((resolve) => {
      this.users.splice(userIndex, 1, { ...user, isDeleted: true });

      resolve();
    });
  };
}
