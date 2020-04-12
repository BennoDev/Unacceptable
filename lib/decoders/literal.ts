import { IDecoder, DecodeResult, Literal } from "../types.ts";
import { success, failure } from "../result.ts";

// Exported here because the type is required for the UnionDecoder
export class LiteralDecoder<Type extends Literal> implements IDecoder<Type> {
  readonly __TYPE__: Type;

  constructor(literal: Type) {
    this.__TYPE__ = literal;
  }

  decode(value: unknown): DecodeResult<Type> {
    return value === this.__TYPE__
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
