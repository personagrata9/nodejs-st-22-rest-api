import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { usersDB } from 'src/db/users.db';

@Injectable()
export class UsersService {
  private usersDB: IUser[];

  constructor() {
    this.usersDB = usersDB;
  }

  findAutoSuggestUsers = (
    limit: string,
    offset: string,
    loginSubstring: string | undefined,
  ): Promise<IUser[]> =>
    new Promise((resolve) => {
      const filteredByLoginSubstringUsers = loginSubstring
        ? this.usersDB.filter((user) => user.login.includes(loginSubstring))
        : this.usersDB;

      const users = filteredByLoginSubstringUsers
        .filter((user) => !user.isDeleted)
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(+offset, +limit + +offset);

      resolve(users);
    });

  count = (): Promise<number> =>
    new Promise((resolve) => {
      const count = this.usersDB.length;
      resolve(count);
    });

  findOneById = (id: string): Promise<IUser> =>
    new Promise((resolve, reject) => {
      const user = this.usersDB.find(
        (user) => user.id === id && !user.isDeleted,
      );

      if (user) {
        resolve(user);
      } else {
        reject();
      }
    });

  create = (createUserDto: CreateUserDto): Promise<IUser> =>
    new Promise((resolve) => {
      const id: string = uuidv4();
      const newUser = {
        id,
        ...createUserDto,
      };
      this.usersDB.push(newUser);

      resolve(newUser);
    });
}
