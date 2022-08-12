import { Request, Response } from 'express';

export const logArguments = (req: Request, res: Response) => {
  console.group('ARGUMENTS');
  console.log('\x1b[33m%s\x1b[0m', req);
  console.log('\x1b[32m%s\x1b[0m', res);
  console.groupEnd();
};
