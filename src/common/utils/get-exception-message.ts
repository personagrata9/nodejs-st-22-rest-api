import { HttpException } from '@nestjs/common';
import { IExceptionResponse } from '../interfaces/exception-response.interface';

export const getExceptionMessage = (exception: unknown): string | string[] => {
  if (exception instanceof HttpException) {
    return (exception.getResponse() as IExceptionResponse).message;
  } else if (exception instanceof Error) {
    return exception.message;
  } else {
    return 'Something went wrong!';
  }
};
