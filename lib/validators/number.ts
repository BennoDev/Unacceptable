import { ValidationResult } from "../types.ts";
import { ValidatorWithRules } from "../validator.ts";
import { failure, success } from "../result.ts";

class NumberValidator extends ValidatorWithRules<number> {
  validate(value: unknown): ValidationResult<number> {
    if (typeof value !== "number") {
      return failure([
        { message: "Given value is not a valid number", name: "number", value },
      ]);
    }

    const errors = this.validateRules(value);
    return errors.length > 0 ? failure(errors) : success(value);
  }
}

/**
 * Creates a validator for numbers, infers to `number`.
 */
export const number = () => new NumberValidator();
