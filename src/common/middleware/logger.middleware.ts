import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`METHOD ${req.method} PATH ${req.url}`);

    console.group('ARGUMENTS');
    console.log('\x1b[33m%s\x1b[0m', req);
    console.log('\x1b[32m%s\x1b[0m', res);
    console.groupEnd();

    next();
  }
}
