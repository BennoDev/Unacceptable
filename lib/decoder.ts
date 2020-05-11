import {
  ValidationRule,
  ValidationError,
  IDecoder,
  DecodeResult
} from "./types.ts";

export abstract class Decoder<Type> implements IDecoder<Type> {
  readonly __TYPE__!: Type;

  abstract decode(value: unknown): DecodeResult<Type>;

  protected withContext(
    errors: ValidationError[],
    part: string
  ): ValidationError[] {
    const errorsWithContext: ValidationError[] = [];

    for (const error of errors) {
      const path = Array.isArray(error.path)
        ? [part, ...error.path]
        : [part];
      errorsWithContext.push(
        { ...error, path }
      );
    }

    return errorsWithContext;
  }
}

export abstract class DecoderWithRules<Type> implements IDecoder<Type> {
  readonly __TYPE__!: Type;

  private rules: Array<ValidationRule<Type>> = [];

  abstract decode(value: unknown): DecodeResult<Type>;

  withRule(rule: ValidationRule<Type>): this {
    this.rules.push(rule);
    return this;
  }

  protected validateRules(value: Type) {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule.fn(value);
      return error
        ? [...errors, { message: error, value: value, name: rule.name }]
        : errors;
    }, []);
  }

  protected withContext(
    errors: ValidationError[],
    part: string
  ): ValidationError[] {
    const errorsWithContext: ValidationError[] = [];

    for (const error of errors) {
      const path = Array.isArray(error.path)
        ? [part, ...error.path]
        : [part];
      errorsWithContext.push(
        { ...error, path }
      );
    }

    return errorsWithContext;
  }
}
