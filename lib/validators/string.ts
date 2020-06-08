import { ValidationResult } from "../types.ts";
import { ValidatorWithRules } from "../validator.ts";
import { failure, success } from "../result.ts";

class StringValidator extends ValidatorWithRules<string> {
  validate(value: unknown): ValidationResult<string> {
    if (typeof value !== "string") {
      return failure([
        { message: "Given value is not a string", name: "string", value },
      ]);
    }

    const errors = this.validateRules(value);
    return errors.length > 0 ? failure(errors) : success(value);
  }
}

/**
 * Creates a validator for strings, infers to `string`.
 */
export const string = () => new StringValidator();
