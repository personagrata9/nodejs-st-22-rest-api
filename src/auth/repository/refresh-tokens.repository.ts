import { IRepository } from '../../common/interfaces/repository.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

export interface RefreshTokensRepository
  extends Pick<IRepository<IRefreshToken>, 'create' | 'update'> {
  findOneByUserId(userId: string): Promise<IRefreshToken | null>;
}
