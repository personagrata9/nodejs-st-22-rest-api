import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from '../interfaces/exception-response.interface';
import { getExceptionMessage } from './get-exception-message';

export const getExceptionResponse = (exception: unknown): ExceptionResponse => {
  const statusCode: number =
    exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

  const message: string | string[] = getExceptionMessage(exception);

  const error: string =
    exception instanceof HttpException
      ? (exception.getResponse() as ExceptionResponse).error
      : 'Internal Server Error';

  return {
    statusCode,
    message,
    error,
  };
};
