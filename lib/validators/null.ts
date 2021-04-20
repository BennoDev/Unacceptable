import { ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success } from "../result.ts";

class NullValidator extends Validator<null> {
  validate(value: unknown): ValidationResult<null> {
    return value === null ? success(value) : failure([
      {
        message: "Given value is not null or undefined",
        name: "null",
        value,
      },
    ]);
  }
}

/**
 * Creates a validator for null values, infers to `null`.
 */
export const nullValidator = () => new NullValidator();
