import {
  ValidationRule,
  ValidationError,
  ICustomizableDecoder,
  DecodeResult
} from "../types.ts";
import { failure, success } from "../result.ts";

class NumberDecoder implements ICustomizableDecoder<number> {
  readonly __TYPE__: number = 0;

  private rules: Array<ValidationRule<number>> = [];

  decode(value: unknown): DecodeResult<number> {
    if (typeof value !== "number") {
      return failure(
        [{ message: "Given value is not a valid number", value }]
      );
    }

    const errors = this.validateRules(value);
    return errors.length > 0
      ? failure(errors)
      : success(value);
  }

  withRule(rule: ValidationRule<number>): this {
    this.rules.push(rule);
    return this;
  }

  private validateRules(value: number): ValidationError[] {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule(value);
      return error ? [...errors, { message: error, value: value }] : errors;
    }, []);
  }
}

export const number = () => new NumberDecoder();
