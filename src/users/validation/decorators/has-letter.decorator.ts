import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function HasLetter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'HasLetter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: `${property} must contain at least one letter`,
        ...validationOptions,
      },
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            /[a-zA-Z]/.test(value)
          );
        },
      },
    });
  };
}
