import {
  ICustomizableDecoder,
  ValidationRule,
  DecodeResult,
  ValidationError
} from "./types.ts";
import { failure, success } from "./result.ts";

class StringDecoder implements ICustomizableDecoder<string> {
  readonly __TYPE__: string;

  private rules: Array<ValidationRule<string>> = [];

  decode(value: unknown): DecodeResult<string> {
    if (typeof value !== "string") {
      return failure([{ message: "Given value is not a string", value }]);
    }

    const errors = this.validateRules(value);
    return errors.length > 0
      ? failure(errors)
      : success(value);
  }

  withRule(rule: ValidationRule<string>): this {
    this.rules.push(rule);
    return this;
  }

  private validateRules(value: string): ValidationError[] {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule(value);
      return error ? [...errors, { message: error, value: value }] : errors;
    }, []);
  }
}

export const string = () => new StringDecoder();
