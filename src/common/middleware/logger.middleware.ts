import 'dotenv/config';
import { Injectable, LogLevel, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MainLogger } from '../loggers/main-logger.service';
import { logArguments } from '../utils/log-arguments';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: MainLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(`METHOD ${req.method} PATH ${req.url}`);
      logArguments(this.logger, req, res);
    });

    next();
  }
}
