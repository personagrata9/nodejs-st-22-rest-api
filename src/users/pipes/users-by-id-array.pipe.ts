import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { UserByIdPipe } from './user-by-id.pipe';
import { AddUsersToGroupDto } from '../../groups/dto/add-users-to-group.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class UsersArrayByIdPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(
    addUsersToGroupDto: AddUsersToGroupDto,
  ): Promise<AddUsersToGroupDto> {
    const { userIds } = addUsersToGroupDto;

    const results = await Promise.allSettled(
      userIds.map((userId) =>
        new UserByIdPipe(this.usersService).transform(userId),
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
