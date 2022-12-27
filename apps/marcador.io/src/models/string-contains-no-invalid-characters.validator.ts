import { registerDecorator, ValidationOptions } from 'class-validator';

export function StringContainsNoInvalidCharacters(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'stringContainsNoInvalidCharacters',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(pretenderValue: any) {
          const areParameterValid = typeof pretenderValue === 'string';
          if (!areParameterValid) {
            return false;
          }
          return (
            pretenderValue.replace(/[`!$%&*()\=\[\]{};'"\\|,.<>\/?]/, '') ===
            pretenderValue
          );
        },
      },
    });
  };
}
