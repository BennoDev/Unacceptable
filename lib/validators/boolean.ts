import { ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success } from "../result.ts";

class BooleanValidator extends Validator<boolean> {
  validate(value: unknown): ValidationResult<boolean> {
    return typeof value !== "boolean"
      ? failure([
        { message: "Given value is not a boolean", name: "boolean", value },
      ])
      : success(value);
  }
}

/**
 * Creates a validator for boolean types, infers to `boolean`.
 */
export const boolean = () => new BooleanValidator();
