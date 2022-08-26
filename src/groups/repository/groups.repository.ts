import { IRepository } from '../../common/interfaces/repository.interface';
import { IGroup } from '../interfaces/group.interface';

export interface GroupsRepository extends IRepository<IGroup> {
  addUsersToGroup(id: string, userIds: string[]): Promise<void>;
}
