import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(id: string): Promise<IUser> {
    const user: IUser = await this.usersService.findOneById(id);

    if (user) {
      if (user.isDeleted) {
        throw new NotFoundException(`user with id ${id} is deleted`);
      }

      return user;
    } else {
      throw new NotFoundException(`user with id ${id} doesn't exist`);
    }
  }
}
