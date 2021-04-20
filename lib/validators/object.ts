import { ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success } from "../result.ts";

class ObjectValidator extends Validator<object> {
  validate(value: unknown): ValidationResult<object> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? success(value)
      : failure([
        { message: "Given value is not an object", name: "object", value },
      ]);
  }
}

/**
 * Creates a validator for objects, infers to `object`.
 * Will return a failure response for arrays.
 */
export const object = () => new ObjectValidator();
