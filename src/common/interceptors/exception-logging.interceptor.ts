import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { WinstonLogger } from '../loggers/winston.logger';
import { logException } from '../utils/log-exception';
import { IExceptionResponse } from '../interfaces/exception-response.interface';
import { getExceptionResponse } from '../utils/get-exception-response';

@Injectable()
export class ExceptionLoggingInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor() {
    this.logger = WinstonLogger.getInstance();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (error: unknown) => {
        const ctx = context.switchToHttp();

        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        const exceptionResponse: IExceptionResponse =
          getExceptionResponse(error);

        res.status(exceptionResponse.statusCode).json(exceptionResponse);

        const className = context.getClass().name;
        const methodKey = context.getHandler().name;

        const exeptionContext = `${className}.${methodKey}`;

        logException(this.logger, exceptionResponse, req, res, exeptionContext);
      }),
    );
  }
}
