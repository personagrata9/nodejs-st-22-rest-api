import { IUser } from '../../users/interfaces/user.interface';
import { ITokens } from './tokens.interface';

export interface ILoginResponse {
  user: Pick<IUser, 'login' | 'age'>;
  jwt: ITokens;
}
