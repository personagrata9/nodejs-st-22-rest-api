import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { RefreshToken } from '../models/refresh-token.model';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SequelizeRefreshTokensRepository
  implements RefreshTokensRepository
{
  constructor(
    @InjectModel(RefreshToken)
    private refreshTokenModel: typeof RefreshToken,
  ) {}

  findOneByUserId = async (userId: string): Promise<IRefreshToken | null> => {
    const refreshToken: RefreshToken = await this.refreshTokenModel.findOne({
      where: { userId },
    });

    return refreshToken ? refreshToken.toJSON() : null;
  };

  create = async (dto: Omit<IRefreshToken, 'id'>): Promise<IRefreshToken> => {
    const { token, userId } = dto;

    const newRefreshToken: RefreshToken = await this.refreshTokenModel.create({
      token: await bcrypt.hash(token, 10),
      userId,
    });

    return newRefreshToken.toJSON();
  };

  update = async (
    refreshToken: IRefreshToken,
    token: string,
  ): Promise<IRefreshToken> => {
    const { userId } = refreshToken;

    const updatedRefreshToken: RefreshToken = (
      await this.refreshTokenModel.update(
        { token: await bcrypt.hash(token, 10) },
        {
          where: { userId },
          returning: true,
        },
      )
    )[1][0];

    return updatedRefreshToken.toJSON();
  };
}
