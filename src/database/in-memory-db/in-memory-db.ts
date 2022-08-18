import { IRefreshToken } from 'src/auth/interfaces/refresh-token.interface';
import { IGroup } from 'src/groups/interfaces/group.interface';
import { IUser } from 'src/users/interfaces/user.interface';

interface IInMemoryDB {
  users: IUser[];
  groups: IGroup[];
  userGroup: string[][];
  refreshTokens: IRefreshToken[];
}

export const inMemoryDB: IInMemoryDB = {
  users: [],
  groups: [],
  userGroup: [],
  refreshTokens: [],
};
