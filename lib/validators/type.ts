import {
  ValidationResult,
  IValidator,
  ValidationError,
  Literal,
  Infer,
} from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success, isSuccess } from "../result.ts";

type TypeOfProps<Props extends Record<string, IValidator<any>>> = {
  [Key in keyof Props]: Infer<Props[Key]>;
};

class TypeValidator<
  Props extends Record<string, IValidator<any>>
> extends Validator<
  // Can't use TypeOfProps here, as this type is treated different as an inline type declaration and results in incorrect inferrence
  {
    [Key in keyof Props]: Infer<Props[Key]>;
  }
> {
  constructor(private readonly validators: Props) {
    super();
  }

  validate(value: unknown): ValidationResult<TypeOfProps<Props>> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return failure([
        { message: "Given value is not an object", name: "object", value },
      ]);
    }

    return this.validateObject(value as Record<Literal, unknown>);
  }

  private validateObject(
    value: Record<Literal, unknown>
  ): ValidationResult<TypeOfProps<Props>> {
    const validated: Record<Literal, unknown> = {};
    const errors: ValidationError[] = [];

    for (const [key, validator] of Object.entries(this.validators)) {
      const result = validator.validate(value[key]);
      if (isSuccess(result)) {
        validated[key] = result.value;
      } else {
        errors.push(...this.withPath(result.errors, key));
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(validated as TypeOfProps<Props>);
  }
}

/**
 * Validates a defined object with the given validators, properties that do not have a validator
 * defined will be stripped from the result. Infers the result to an object with the shape and the types of the given validators.
 * @param validators Shape of the object to be validated, and the validators for each property.
 * @example
 * const validator = type({
 *   firstName: string(),
 *   lastnName: string()
 * });
 * type Name = Infer<typeof validator>;
 * // Name = { firstName: string, lastName: string }
 */
export const type = <Props extends Record<string, IValidator<any>>>(
  validators: Props
) => new TypeValidator(validators);
