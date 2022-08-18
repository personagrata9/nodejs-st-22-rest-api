import { IRepository } from 'src/common/interfaces/repository.interface';
import { IUser } from '../interfaces/user.interface';

export interface UsersRepository extends IRepository<IUser> {
  findOneByLogin(login: string): Promise<IUser>;
}
