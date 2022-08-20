import { BadRequestException } from '@nestjs/common';
import { NotUniqueError } from './not-unique.error';

export const errorHadler = (error: unknown) => {
  if (error instanceof NotUniqueError) {
    return new BadRequestException(error.message);
  } else {
    return error;
  }
};
