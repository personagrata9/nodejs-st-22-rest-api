import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { usersDB } from 'src/db/users.db';
import { UpdateUserDto } from '../dto/update-user.dto';

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
      const { login, password, age, isDeleted } = createUserDto;
      const newUser: IUser = {
        id,
        login,
        password,
        age,
        isDeleted,
      };
      this.usersDB.push(newUser);

      resolve(newUser);
    });

  update = (id: string, updateUserDto: UpdateUserDto): Promise<IUser> =>
    new Promise((resolve, reject) => {
      const user = this.usersDB.find(
        (user) => user.id === id && !user.isDeleted,
      );

      if (user) {
        const { login, password, age, isDeleted } = user;

        const updatedUser: IUser = {
          id,
          login: updateUserDto.login || login,
          password: updateUserDto.password || password,
          age: updateUserDto.age || age,
          isDeleted: updateUserDto.isDeleted || isDeleted,
        };

        const userIndex = this.usersDB.findIndex((user) => user.id === id);
        this.usersDB.splice(userIndex, 1, updatedUser);

        resolve(updatedUser);
      } else {
        reject();
      }
    });

  delete = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const user = this.usersDB.find(
        (user) => user.id === id && !user.isDeleted,
      );

      if (user) {
        const userIndex = this.usersDB.findIndex((user) => user.id === id);
        this.usersDB.splice(userIndex, 1, { ...user, isDeleted: true });

        resolve();
      } else {
        reject();
      }
    });
}
