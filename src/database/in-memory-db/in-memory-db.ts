import { IRefreshToken } from '../../auth/interfaces/refresh-token.interface';
import { IGroup } from '../../groups/interfaces/group.interface';
import { IUser } from '../../users/interfaces/user.interface';

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
