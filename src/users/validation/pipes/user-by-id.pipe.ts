import {
  PipeTransform,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { User } from '../../interfaces/user.interface';
import { UsersRepository } from 'src/users/repository/users.repository';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(
    @Inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async transform(id: string) {
    const user: User = await this.usersRepository.findOneById(id);

    if (user) {
      return id;
    } else {
      throw new NotFoundException(`user with id ${id} not found`);
    }
  }
}
