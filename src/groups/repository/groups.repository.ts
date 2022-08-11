import { IRepository } from 'src/common/interfaces/repository.interface';
import { IGroup } from '../interfaces/group.interface';

export interface GroupsRepository extends IRepository<IGroup> {
  addUsersToGroup(group: IGroup, userIds: string[]): Promise<void>;
}
