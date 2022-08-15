import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { WinstonLogger } from '../loggers/winston.logger';
import { logArguments } from '../utils/log-arguments';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(private readonly context?: string) {
    this.context = context;
    this.logger = WinstonLogger.getInstance();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string | string[] = this.getMessage(exception);

    const error: string =
      exception instanceof HttpException
        ? exception.name
        : 'Internal Server Error';

    res.status(statusCode).json({ statusCode, message, error });

    this.logError(statusCode, error, message, req, res);
  }

  private getMessage = (exception: unknown): string | string[] => {
    if (exception instanceof HttpException) {
      return (exception.getResponse() as ErrorResponse).message;
    } else if (exception instanceof Error) {
      return exception.message;
    } else {
      return 'Something went wrong!';
    }
  };

  private logError = (
    statusCode: number,
    error: string,
    message: string | string[],
    req: Request,
    res: Response,
  ) => {
    const errorMessage =
      typeof message === 'string' ? message : message.join('; ');

    this.logger.error(`${statusCode} ${error}: ${errorMessage}`, {
      context: this.context,
    });

    logArguments(this.logger, req, res);
  };
}
