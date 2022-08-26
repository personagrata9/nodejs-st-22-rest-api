import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenGuard } from '../../auth/guards/refresh-token.guard';
import { ITokens } from '../interfaces/tokens.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';
import { ILoginResponse } from '../interfaces/login-response.interface';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _: LoginDto,
    @Req() req: Request,
  ): Promise<ILoginResponse> {
    const user = req.user as IUser;
    const { login, age } = user;
    const jwt: ITokens = await this.authService.getTokens(user);

    return {
      user: {
        login,
        age,
      },
      jwt,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request): Promise<ITokens> {
    return this.authService.refreshTokens(req.user as IUser);
  }
}
