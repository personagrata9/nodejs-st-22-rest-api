import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { usersDB } from 'src/db/users.db';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ValidatorConstraint({ async: true })
export class IsLoginAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  validate(login: string) {
    const usersLogins: string[] = usersDB.map((user) => user.login);

    return !usersLogins.includes(login);
  }
  defaultMessage() {
    return 'user with login $value already exists, please choose another login';
  }
}

export function IsLoginAlreadyExist(validationOptions?: ValidationOptions) {
  return function (
    object: CreateUserDto | UpdateUserDto,
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLoginAlreadyExistConstraint,
    });
  };
}
