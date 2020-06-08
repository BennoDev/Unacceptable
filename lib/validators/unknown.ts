import { ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { success } from "../result.ts";

class UnknownValidator extends Validator<unknown> {
  validate(value: unknown): ValidationResult<unknown> {
    return success(value);
  }
}

/**
 * Creates a validator whose result will infer to `unknown`.
 * This validator will **always** return a successful result.
 */
export const unknown = () => new UnknownValidator();
