import { IRepository } from 'src/common/interfaces/repository.interface';
import { IGroup } from '../interfaces/group.interface';

export interface GroupsRepository extends IRepository<IGroup> {
  addUsersToGroup(groupId: string, userIds: string[]): Promise<void>;
}
