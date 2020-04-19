import { ValidationRule, ValidationError, DecodeResult } from "./types.ts";

export abstract class Decoder<Type> {
  readonly __TYPE__!: Type;

  constructor(readonly decode: (value: unknown) => DecodeResult<Type>) {}
}

export abstract class DecoderWithRules<Type> {
  readonly __TYPE__!: Type;

  protected rules: Array<ValidationRule<Type>> = [];

  constructor(readonly decode: (value: unknown) => DecodeResult<Type>) {}

  withRule(rule: ValidationRule<Type>): this {
    this.rules.push(rule);
    return this;
  }

  protected validateRules(value: Type) {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule(value);
      return error ? [...errors, { message: error, value: value }] : errors;
    }, []);
  }
}
