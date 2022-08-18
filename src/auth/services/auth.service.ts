import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from './refresh-tokens.service';
import { ITokens } from '../interfaces/tokens.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('RefreshTokensRepository')
    private refreshTokensService: RefreshTokensService,
  ) {}

  login = async (user: IUser): Promise<ITokens> => {
    const { id: userId, login: username } = user;

    return this.refreshTokens(userId, username);
  };

  refreshTokens = async (
    userId: string,
    username: string,
  ): Promise<ITokens> => {
    const tokens = await this.generateTokens(userId, username);

    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  };

  private generateTokens = async (
    userId: string,
    username: string,
  ): Promise<ITokens> => {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: username,
          userId,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: username,
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

  private updateRefreshToken = async (
    userId: string,
    token: string,
  ): Promise<void> => {
    const existingRefreshToken: IRefreshToken =
      await this.refreshTokensService.findOneByUserId(userId);

    if (existingRefreshToken) {
      this.refreshTokensService.update(existingRefreshToken, token);
    } else {
      this.refreshTokensService.create({
        token,
        userId,
      });
    }
  };
}
