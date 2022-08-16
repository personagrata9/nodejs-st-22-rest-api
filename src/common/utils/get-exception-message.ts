import { HttpException } from '@nestjs/common';
import { ExceptionResponse } from '../interfaces/exception-response.interface';

export const getExceptionMessage = (exception: unknown): string | string[] => {
  if (exception instanceof HttpException) {
    return (exception.getResponse() as ExceptionResponse).message;
  } else if (exception instanceof Error) {
    return exception.message;
  } else {
    return 'Something went wrong!';
  }
};
