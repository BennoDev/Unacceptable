import {
  Infer,
  IValidator,
  Literal,
  ValidationError,
  ValidationResult,
} from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, isSuccess, success } from "../result.ts";

type TypeOfProps<Props extends Record<string, IValidator<any>>> = {
  [Key in keyof Props]: Infer<Props[Key]>;
};

class PartialValidator<
  Props extends Record<string, IValidator<any>>,
> extends Validator<
  // Can't use TypeOfProps here, as this type is treated different as an inline type declaration and results in incorrect inferrence
  {
    [Key in keyof Props]?: Infer<Props[Key]>;
  }
> {
  constructor(private readonly validators: Props) {
    super();
  }

  validate(value: unknown): ValidationResult<Partial<TypeOfProps<Props>>> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return failure([
        { message: "Given value is not an object", name: "object", value },
      ]);
    }

    return this.validateObject(value as Record<Literal, unknown>);
  }

  private validateObject(
    value: Record<Literal, unknown>,
  ): ValidationResult<Partial<TypeOfProps<Props>>> {
    const validated: Record<Literal, unknown> = {};
    const errors: ValidationError[] = [];

    for (const [key, validator] of Object.entries(this.validators)) {
      if (typeof value[key] !== "undefined") {
        const result = validator.validate(value[key]);
        if (isSuccess(result)) {
          validated[key] = result.value;
        } else {
          errors.push(...this.withPath(result.errors, key));
        }
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(validated as Partial<TypeOfProps<Props>>);
  }
}

/**
 * Validates a defined object with the given validators, properties that do not have a validator defined
 * will be stripped from the result. Infers the result to an object with the shape and the types of the given validators.
 * Properties that are undefined will not cause the validation to fail, essentially partial makes each property optional.
 * @param validators Shape of the object to be validated, and the validators for each property.
 * @example
 * const validator = partial({
 *   name: string(),
 *   age: number(),
 * })
 * type CustomPartial = Infer<typeof validator>;
 * // CustomPartial = { name: string | undefined, age: string | undefined }.
 */
export const partial = <Props extends Record<string, IValidator<any>>>(
  validators: Props,
) => new PartialValidator(validators);
