import { Literal, DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success, failure } from "../result.ts";

class LiteralDecoder<Type extends Literal> extends Decoder<Type> {
  constructor(private readonly literal: Type) {
    super();
  }

  decode(value: unknown): DecodeResult<Type> {
    return value === this.literal
      ? success(value as Type)
      : failure([
          {
            message: `Given value ${value} is not equal to expected: ${this.__TYPE__}`,
            name: literal.toString(),
            value,
          },
        ]);
  }
}

export const literal = <Type extends Literal>(value: Type) =>
  new LiteralDecoder(value);
