import { IDecoder, DecodeResult, Literal } from "../types.ts";
import { success, failure } from "../result.ts";

class LiteralDecoder<Type extends Literal> implements IDecoder<Type> {
  readonly __TYPE__!: Type;

  constructor(private readonly literal: Type) {}

  decode(value: unknown): DecodeResult<Type> {
    return value === this.literal
      ? success(value as Type)
      : failure(
        [{
          message: `Given value ${value} is not equal to expected: ${this
            .__TYPE__}`,
          value
        }]
      );
  }
}

export const literal = <Type extends Literal>(value: Type) =>
  new LiteralDecoder(value);
