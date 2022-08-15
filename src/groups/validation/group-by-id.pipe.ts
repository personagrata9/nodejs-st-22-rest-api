import {
  PipeTransform,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IGroup } from '../interfaces/group.interface';
import { GroupsRepository } from '../repository/groups.repository';

@Injectable()
export class GroupByIdPipe implements PipeTransform {
  constructor(
    @Inject('GroupsRepository') private groupsRepository: GroupsRepository,
  ) {}

  async transform(id: string) {
    const group: IGroup = await this.groupsRepository.findOneById(id);

    if (group) {
      return group;
    } else {
      throw new NotFoundException(`group with id ${id} doesn't exist`);
    }
  }
}
