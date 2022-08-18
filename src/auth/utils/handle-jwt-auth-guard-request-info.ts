import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const handleJwtAuthGuardRequestInfo = (info: any) => {
  const { message } = info;

  switch (message) {
    case 'No auth token':
      throw new UnauthorizedException('jwt token must be provided');
    case 'jwt expired':
      throw new ForbiddenException('jwt token expired');
    default:
      throw new ForbiddenException('invalid jwt token');
  }
};
