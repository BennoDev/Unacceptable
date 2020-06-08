import { ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { success } from "../result.ts";

class AnyValidator extends Validator<any> {
  validate(value: unknown): ValidationResult<any> {
    return success(value);
  }
}

/**
 * Creates a validator whose result will infer to `any`.
 * This validator will **always** return a successful result.
 */
export const any = () => new AnyValidator();
