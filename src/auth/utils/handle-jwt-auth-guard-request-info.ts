import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const handleJwtAuthGuardRequestInfo = (info: any) => {
  if (info.message === 'No auth token') {
    throw new UnauthorizedException('authorization required');
  } else {
    throw new ForbiddenException('access denied');
  }
};
