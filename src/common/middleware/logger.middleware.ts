import 'dotenv/config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logArguments } from '../utils/log-arguments';
import { Logger } from 'winston';
import { WinstonLogger } from '../loggers/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = WinstonLogger.getInstance();
  }

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.info(`METHOD ${req.method} PATH ${req.url}`);
      logArguments(this.logger, req, res);
    });

    next();
  }
}
