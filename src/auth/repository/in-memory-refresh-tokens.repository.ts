import { Injectable } from '@nestjs/common';
import { inMemoryDB } from 'src/database/in-memory-db/in-memory-db';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InMemoryRefreshTokensRepository
  implements RefreshTokensRepository
{
  private refreshTokens: IRefreshToken[] = inMemoryDB.refreshTokens;

  private findOneById = async (id: string): Promise<IRefreshToken | null> =>
    new Promise((resolve) => {
      const refreshToken: IRefreshToken = this.refreshTokens.find(
        (token) => token.id === id,
      );
      resolve(refreshToken || null);
    });

  findOneByUserId = async (userId: string): Promise<IRefreshToken | null> =>
    new Promise((resolve) => {
      const refreshToken: IRefreshToken = this.refreshTokens.find(
        (token) => token.userId === userId,
      );
      resolve(refreshToken || null);
    });

  private createTokenId = async (): Promise<string> => {
    const id: string = uuidv4();

    const refreshToken: IRefreshToken = await this.findOneById(id);
    if (refreshToken) await this.createTokenId();

    return id;
  };

  create = async (dto: Omit<IRefreshToken, 'id'>): Promise<IRefreshToken> => {
    const id: string = await this.createTokenId();
    const { token, userId } = dto;
    const hashedToken: string = await bcrypt.hash(token, 10);

    return new Promise((resolve) => {
      const newRefreshToken: IRefreshToken = {
        id,
        token: hashedToken,
        userId,
      };
      this.refreshTokens.push(newRefreshToken);

      resolve(newRefreshToken);
    });
  };

  update = async (
    refreshToken: IRefreshToken,
    token: string,
  ): Promise<IRefreshToken> => {
    const hashedToken: string = await bcrypt.hash(token, 10);

    return new Promise((resolve) => {
      const updatedRefreshToken: IRefreshToken = {
        ...refreshToken,
        token: hashedToken,
      };

      const refreshTokenIndex: number = this.refreshTokens.findIndex(
        (token) => token.id === refreshToken.id,
      );
      this.refreshTokens.splice(refreshTokenIndex, 1, updatedRefreshToken);

      resolve(updatedRefreshToken);
    });
  };
}
