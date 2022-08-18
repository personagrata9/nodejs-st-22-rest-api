import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';
import { ITokens } from '../interfaces/tokens.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<ITokens> {
    return this.authService.login(req.user as IUser);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request): Promise<ITokens> {
    const userId = req.user['userId'];
    const username = req.user['sub'];

    return this.authService.refreshTokens(userId, username);
  }
}
