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

/**
 * Creates a decoder for a literal value (can be `number | string`). Mostly used in combination with a `union` decoder.
 * The value will infer to the given literal.
 * @param value The literal that will be decoded against.
 *
 * @example
 * const decoder = literal("200");
 * type OkStatusCode = Infer<typeof decoder>
 * // OkStatusCode = "200"
 */
export const literal = <Type extends Literal>(value: Type) =>
  new LiteralDecoder(value);
