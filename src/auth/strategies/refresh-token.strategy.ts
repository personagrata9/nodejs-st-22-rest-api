import 'dotenv/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/services/users.service';
import { RefreshTokensService } from '../services/refresh-tokens.service';
import { IUser } from 'src/users/interfaces/user.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const userId: string = payload['userId'];
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    const user: IUser = await this.usersService.findOneById(userId);
    const userRefreshToken: IRefreshToken =
      await this.refreshTokensService.findOneByUserId(userId);

    if (!user || user.isDeleted || !userRefreshToken) {
      throw new ForbiddenException('access denied');
    }

    if (refreshToken !== userRefreshToken.token) {
      throw new ForbiddenException('access denied');
    }

    return user;
  }
}
