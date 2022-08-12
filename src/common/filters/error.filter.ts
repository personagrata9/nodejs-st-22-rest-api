import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GroupsController } from 'src/groups/controllers/groups.controller';
import { UsersController } from 'src/users/controllers/users.controller';
import { logArguments } from '../utils/log-arguments';

type MethodNameType = keyof UsersController | keyof GroupsController;

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;
  private readonly context: string;

  constructor(
    private readonly controllerName: string,
    private readonly methodName: MethodNameType,
  ) {
    this.context = this.controllerName + '.' + this.methodName;
    this.logger = new Logger(this.context);
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

    this.logger.error(`${statusCode} ${error}: ${errorMessage}`);

    logArguments(req, res);
  };
}
