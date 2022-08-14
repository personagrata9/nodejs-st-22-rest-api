import { Catch } from '@nestjs/common';
import { GroupsController } from 'src/groups/controllers/groups.controller';
import { UsersController } from 'src/users/controllers/users.controller';
import { ErrorFilter } from './error.filter';

type MethodNameType = keyof UsersController | keyof GroupsController;

@Catch()
export class ControllerErrorFilter extends ErrorFilter {
  constructor(
    private readonly controllerName: string,
    private readonly methodName: MethodNameType,
  ) {
    super(`${controllerName}.${methodName}`);
  }
}
