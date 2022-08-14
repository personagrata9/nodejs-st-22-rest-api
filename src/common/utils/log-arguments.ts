import { Request, Response } from 'express';
import safeJsonStringify from 'safe-json-stringify';
import { Logger } from 'winston';

export const logArguments = (logger: Logger, req: Request, res: Response) => {
  const reqStringified: string = safeJsonStringify(req, null, 2);
  const resStringified: string = safeJsonStringify(res, null, 2);

  logger.debug(
    `ARGUMENTS\nrequest: ${reqStringified}\n\nresponse: ${resStringified}\n`,
  );
};
