import 'dotenv/config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logArguments } from '../utils/log-arguments';
import { logger } from '../loggers/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      logger.info(`METHOD ${req.method} PATH ${req.url}`);
      logArguments(logger, req, res);
    });

    next();
  }
}
