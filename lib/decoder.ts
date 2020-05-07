import {
  ValidationRule,
  ValidationError,
  IDecoder,
  DecodeResult,
} from "./types.ts";

export abstract class Decoder<Type> implements IDecoder<Type> {
  readonly __TYPE__!: Type;

  abstract decode(value: unknown): DecodeResult<Type>;
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
      const error = rule(value);
      return error ? [...errors, { message: error, value: value }] : errors;
    }, []);
  }
}
