import { ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success } from "../result.ts";

class UndefinedValidator extends Validator<undefined> {
  validate(value: unknown): ValidationResult<undefined> {
    return typeof value === "undefined" ? success(value) : failure([
      { message: "Given value is not undefined", name: "undefined", value },
    ]);
  }
}

/**
 * Creates a validator for undefined values, infers to `undefined`.
 */
export const undefinedValidator = () => new UndefinedValidator();
