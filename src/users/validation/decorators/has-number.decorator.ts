import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function HasNumber(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'HasNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: `${property} must contain at least one number`,
        ...validationOptions,
      },
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            /\d/.test(value)
          );
        },
      },
    });
  };
}
