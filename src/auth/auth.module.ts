import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { RefreshToken } from './models/refresh-token.model';
import { AuthService } from './services/auth.service';
import { RefreshTokensService } from './services/refresh-tokens.service';
import { InMemoryRefreshTokensRepository } from './repository/in-memory-refresh-tokens.repository';
import { SequelizeRefreshTokensRepository } from './repository/sequelize-refresh-tokens.repository';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([RefreshToken]),
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokensService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: 'RefreshTokensRepository',
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryRefreshTokensRepository
          : SequelizeRefreshTokensRepository,
    },
  ],
})
export class AuthModule {}
