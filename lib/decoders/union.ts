import { IDecoder, DecodeResult, Literal } from "../types.ts";
import { success, failure, isSuccess } from "../result.ts";
import { LiteralDecoder } from "./literal.ts";

class UnionDecoder<Type extends Literal> implements IDecoder<Type> {
  readonly __TYPE__: any;

  constructor(private readonly literalDecoders: LiteralDecoder<Type>[]) {}

  decode(value: unknown): DecodeResult<Type> {
    const isValidLiteral = this.literalDecoders.find(decoder =>
      isSuccess(decoder.decode(value))
    );
    if (!isValidLiteral) {
      return failure([{ message: "", value }]);
    }

    return success(value as Type);
  }
}

export const union = <Type extends Literal>(
  literalDecoders: LiteralDecoder<Type>[]
) => new UnionDecoder(literalDecoders);
