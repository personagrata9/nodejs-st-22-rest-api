import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { handleJwtAuthGuardRequestInfo } from '../utils/handle-jwt-auth-guard-request-info';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest(error: any, user: any, info: Error) {
    if (error) {
      throw error;
    }

    if (!user) {
      handleJwtAuthGuardRequestInfo(info);
    }

    return user;
  }
}
