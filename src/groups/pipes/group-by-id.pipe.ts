import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { IGroup } from '../interfaces/group.interface';
import { GroupsService } from '../services/groups.service';

@Injectable()
export class GroupByIdPipe implements PipeTransform {
  constructor(private readonly groupsService: GroupsService) {}

  async transform(id: string): Promise<IGroup> {
    const group: IGroup = await this.groupsService.findOneById(id);

    if (group) {
      return group;
    } else {
      throw new NotFoundException(`group with id ${id} doesn't exist`);
    }
  }
}
