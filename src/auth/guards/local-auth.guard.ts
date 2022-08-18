import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(error: any, user: any) {
    if (error) {
      throw error;
    }

    return user;
  }
}
