import { Logger } from 'winston';
import { Request, Response } from 'express';
import { logArguments } from './log-arguments';
import { IExceptionResponse } from '../interfaces/exception-response.interface';

export const logException = (
  logger: Logger,
  exceptionResponse: IExceptionResponse,
  req: Request,
  res: Response,
  context?: string,
) => {
  const { statusCode, message, error } = exceptionResponse;

  const exceptionMessageString =
    typeof message === 'string' ? message : message.join('; ');

  logger.error(`${statusCode} ${error}: ${exceptionMessageString}`, {
    context,
  });

  logArguments(logger, req, res);
};
