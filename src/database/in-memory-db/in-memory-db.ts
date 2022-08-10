import { IGroup } from 'src/groups/interfaces/group.interface';
import { IUser } from 'src/users/interfaces/user.interface';

interface IInMemoryDB {
  users: IUser[];
  groups: IGroup[];
  userGroup: string[][];
}

export const inMemoruDB: IInMemoryDB = {
  users: [],
  groups: [],
  userGroup: [],
};
