import {
  PipeTransform,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IUser } from '../../interfaces/user.interface';
import { UsersRepository } from 'src/users/repository/users.repository';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(
    @Inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async transform(id: string) {
    const user: IUser = await this.usersRepository.findOneById(id);

    if (user) {
      if (user.isDeleted) {
        throw new NotFoundException(`user with id ${id} is deleted`);
      }

      return id;
    } else {
      throw new NotFoundException(`user with id ${id} doesn't exist`);
    }
  }
}
