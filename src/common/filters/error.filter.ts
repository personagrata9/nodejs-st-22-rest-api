import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../loggers/winston.logger';
import { logArguments } from '../utils/log-arguments';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly context?: string) {
    this.context = context;
  }

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string | string[] =
      exception instanceof HttpException
        ? (exception.getResponse() as ErrorResponse).message
        : exception.message;

    const error: string =
      exception instanceof HttpException
        ? (exception.getResponse() as ErrorResponse).error
        : 'Internal Server Error';

    res.status(statusCode).json({ statusCode, message, error });

    this.logError(statusCode, error, message, req, res);
  }

  private logError = (
    statusCode: number,
    error: string,
    message: string | string[],
    req: Request,
    res: Response,
  ) => {
    const errorMessage =
      typeof message === 'string' ? message : message.join('; ');

    logger.error(`${statusCode} ${error}: ${errorMessage}`, {
      context: this.context,
    });

    logArguments(logger, req, res);
  };
}
