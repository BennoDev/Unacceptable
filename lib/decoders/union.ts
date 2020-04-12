import { IDecoder, DecodeResult, Literal } from "../types.ts";
import { success, failure, isSuccess } from "../result.ts";
import { LiteralDecoder } from "./literal.ts";

class UnionDecoder<Type extends [Literal, ...Literal[]]>
  implements IDecoder<Type> {
  readonly __TYPE__!: Type[number];

  constructor(
    private readonly literalDecoders: LiteralDecoder<Type[number]>[]
  ) {}

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

export const union = <Type extends [Literal, ...Literal[]]>(
  literalDecoders: LiteralDecoder<Type[number]>[]
) => new UnionDecoder(literalDecoders);
