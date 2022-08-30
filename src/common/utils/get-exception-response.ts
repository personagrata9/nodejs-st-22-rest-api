import { HttpException, HttpStatus } from '@nestjs/common';
import { IExceptionResponse } from '../interfaces/exception-response.interface';
import { getExceptionMessage } from './get-exception-message';

export const getExceptionResponse = (
  exception: unknown,
): IExceptionResponse => {
  const statusCode: number =
    exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

  const message: string | string[] = getExceptionMessage(exception);

  const error: string =
    exception instanceof HttpException
      ? (exception.getResponse() as IExceptionResponse).error
      : 'Internal Server Error';

  return {
    statusCode,
    message,
    error,
  };
};
