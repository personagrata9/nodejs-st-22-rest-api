import { IGroup } from 'src/groups/interfaces/group.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { CustomError } from './custom.error';

type EntityNameType = 'user' | 'group';

type propertyName = keyof IUser | keyof IGroup;

export class NotUniqueError extends CustomError {
  constructor(
    entityName: EntityNameType,
    propertyName: propertyName,
    propertyValue: string,
  ) {
    super(
      `${entityName} with ${propertyName} ${propertyValue} already exists, please choose another ${propertyName}`,
    );
    this.name = 'NotUniqueError';
  }
}
