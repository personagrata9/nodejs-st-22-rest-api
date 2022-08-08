import {
  PipeTransform,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from 'src/users/repository/users.repository';
import { UserByIdPipe } from './user-by-id.pipe';
import { AddUsersToGroupDto } from 'src/groups/dto/add-users-to-group.dto';

@Injectable()
export class UsersArrayByIdPipe implements PipeTransform {
  constructor(
    @Inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async transform(addUsersToGroupDto: AddUsersToGroupDto) {
    const { userIds } = addUsersToGroupDto;

    const results = await Promise.allSettled(
      userIds.map((userId) =>
        new UserByIdPipe(this.usersRepository).transform(userId),
      ),
    );

    if (results.find((result) => result.status === 'rejected')) {
      const messagesArray = results
        .filter((result) => result.status === 'rejected')
        .map((result: PromiseRejectedResult) => result.reason.message);

      throw new NotFoundException(messagesArray);
    } else {
      return addUsersToGroupDto;
    }
  }
}
