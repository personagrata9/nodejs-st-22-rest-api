import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logArguments } from '../utils/log.arguments';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`METHOD ${req.method} PATH ${req.url}`);

    logArguments(this.logger, req, res);

    next();
  }
}
