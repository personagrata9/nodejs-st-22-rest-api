import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { usersDB } from 'src/db/users.db';
import { IUser } from 'src/users/models/user.model';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  transform(value: string) {
    const user: IUser = usersDB.find(
      (user) => user.id === value && !user.isDeleted,
    );

    if (user) {
      return value;
    } else {
      throw new NotFoundException(`user with id ${value} not found`);
    }
  }
}
