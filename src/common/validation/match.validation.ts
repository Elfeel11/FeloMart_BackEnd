import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "MatchData", async: false })
export class MatchData implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return value == args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}

export function isMatch(
  fildName: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: fildName,
      validator: MatchData,
    });
  };
}
