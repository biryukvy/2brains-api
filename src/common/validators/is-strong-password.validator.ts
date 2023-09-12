import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { passwordRegex } from '../regex/password.regex';

export function IsStrongPassword(property?: string, validationOptions?: ValidationOptions): Function {
  return function (object: Object, propertyName: string): void {

    const errorMessage: string = `Property ${propertyName} must have form 8 to 50 characters, and contain at least one letter and one number!`;
    validationOptions = { ...validationOptions, ...{ message: errorMessage }};

    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          return new RegExp(passwordRegex).test(value);
        },
      },
    });
  };
}