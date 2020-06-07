import {
  ValidationRule,
  ValidationError,
  IDecoder,
  DecodeResult,
} from "./types.ts";

export abstract class Decoder<Type> implements IDecoder<Type> {
  readonly __TYPE__!: Type;

  abstract decode(value: unknown): DecodeResult<Type>;

  /**
   * Adds context to the given errors.
   * @param errors Errors to enrich
   * @param part Part of the path, essentially context for the error
   */
  protected withPath(
    errors: ValidationError[],
    part: string
  ): ValidationError[] {
    const errorswithPath: ValidationError[] = [];

    for (const error of errors) {
      const path = Array.isArray(error.path) ? [part, ...error.path] : [part];
      errorswithPath.push({ ...error, path });
    }

    return errorswithPath;
  }
}

export abstract class DecoderWithRules<Type> implements IDecoder<Type> {
  readonly __TYPE__!: Type;

  private rules: Array<ValidationRule<Type>> = [];

  abstract decode(value: unknown): DecodeResult<Type>;

  /**
   * Adds a validation rule to the decoder to be executed on each decode call.
   * @param rule The new rule
   */
  withRule(rule: ValidationRule<Type>): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * Passes the value though all the rules in this decoder.
   * @param value The value to decode
   */
  protected validateRules(value: Type) {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule.fn(value);
      return error
        ? [...errors, { message: error, value: value, name: rule.name }]
        : errors;
    }, []);
  }

  /**
   * Adds context to the given errors.
   * @param errors Errors to enrich
   * @param part Part of the path, essentially context for the error
   */
  protected withPath(
    errors: ValidationError[],
    part: string
  ): ValidationError[] {
    const errorswithPath: ValidationError[] = [];

    for (const error of errors) {
      const path = Array.isArray(error.path) ? [part, ...error.path] : [part];
      errorswithPath.push({ ...error, path });
    }

    return errorswithPath;
  }
}
