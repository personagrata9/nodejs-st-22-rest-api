import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import safeJsonStringify from 'safe-json-stringify';

export const logArguments = (logger: Logger, req: Request, res: Response) => {
  const reqStringified: string = safeJsonStringify(req, null, 2);
  const resStringified: string = safeJsonStringify(res, null, 2);

  logger.debug(
    `ARGUMENTS\n\x1b[35mREQUEST\n\x1b[0m${reqStringified}\n\n\x1b[35mRESPONSE\n\x1b[0m${resStringified}\n`,
  );
};
