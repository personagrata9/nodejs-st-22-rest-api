import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from './refresh-tokens.service';
import { ITokens } from '../interfaces/tokens.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('RefreshTokensRepository')
    private refreshTokensService: RefreshTokensService,
  ) {}

  getTokens = async (user: IUser): Promise<ITokens> => {
    const { id: userId } = user;
    const tokens = await this.generateTokens(user);

    const existingRefreshToken: IRefreshToken =
      await this.refreshTokensService.findOneByUserId(userId);

    if (!existingRefreshToken) {
      await this.refreshTokensService.create({
        userId,
        token: tokens.refreshToken,
      });
    } else {
      await this.refreshTokensService.update(userId, tokens.refreshToken);
    }

    return tokens;
  };

  refreshTokens = async (user: IUser): Promise<ITokens> => {
    const tokens = await this.generateTokens(user);

    await this.refreshTokensService.update(user.id, tokens.refreshToken);

    return tokens;
  };

  private generateTokens = async (user: IUser): Promise<ITokens> => {
    const { login, id: userId } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: login,
          userId,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: login,
          userId,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  };
}
