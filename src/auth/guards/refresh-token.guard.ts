import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { handleJwtAuthGuardRequestInfo } from '../utils/handle-jwt-auth-guard-request-info';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(error: any, user: any, info: any) {
    if (error) {
      throw error;
    }

    if (!user) {
      handleJwtAuthGuardRequestInfo(info);
    }

    return user;
  }
}
