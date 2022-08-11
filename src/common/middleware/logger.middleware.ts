import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      'METHOD',
      `\x1b[36m${req.method}\x1b[0m`,
      'PATH',
      `\x1b[36m${req.url}\x1b[0m`,
    );

    console.group();
    console.log('\x1b[33m%s\x1b[0m', req);
    console.log('\x1b[32m%s\x1b[0m', res);
    console.groupEnd();

    next();
  }
}
