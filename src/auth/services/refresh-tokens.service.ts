import { Inject, Injectable } from '@nestjs/common';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { RefreshTokensRepository } from '../repository/refresh-tokens.repository';

@Injectable()
export class RefreshTokensService {
  constructor(
    @Inject('RefreshTokensRepository')
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  findOneByUserId = async (userId: string): Promise<IRefreshToken | null> =>
    this.refreshTokensRepository.findOneByUserId(userId);

  create = async (dto: Omit<IRefreshToken, 'id'>): Promise<IRefreshToken> =>
    this.refreshTokensRepository.create(dto);

  update = async (
    refreshToken: IRefreshToken,
    token: string,
  ): Promise<IRefreshToken> =>
    this.refreshTokensRepository.update(refreshToken, token);
}
