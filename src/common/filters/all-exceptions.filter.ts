import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { ExceptionResponse } from '../interfaces/exception-response.interface';
import { WinstonLogger } from '../loggers/winston.logger';
import { getExceptionResponse } from '../utils/get-exception-response';
import { logException } from '../utils/log-exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger;

  constructor() {
    this.logger = WinstonLogger.getInstance();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const exceptionResponse: ExceptionResponse =
      getExceptionResponse(exception);

    res.status(exceptionResponse.statusCode).json(exceptionResponse);

    logException(this.logger, exceptionResponse, req, res);
  }
}
