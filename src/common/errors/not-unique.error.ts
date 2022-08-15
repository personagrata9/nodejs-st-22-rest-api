import { IGroup } from 'src/groups/interfaces/group.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { CustomError } from './custom.error';

type EntityNameType = 'user' | 'group';

type propertyName = keyof IUser | keyof IGroup;

export class NotUniqueError extends CustomError {
  entityName: EntityNameType;
  propertyName: propertyName;
  propertyValue: string;

  constructor(
    entityName: EntityNameType,
    propertyName: propertyName,
    propertyValue: string,
  ) {
    super(
      `${entityName} with ${propertyName} ${propertyValue} already exists, please choose another ${propertyName}`,
    );
    this.name = 'NotUniqueError';
    this.propertyName = propertyName;
    this.propertyValue = propertyValue;
  }
}
