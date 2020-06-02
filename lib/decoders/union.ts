import { IDecoder, DecodeResult, TypeOf } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, isSuccess } from "../result.ts";

/**
 * Returns result of first decoder
 */
class UnionDecoder<
  Type extends [IDecoder<any>, IDecoder<any>, ...IDecoder<any>[]]
> extends Decoder<TypeOf<Type[number]>> {
  constructor(private readonly decoders: Type) {
    super();
  }

  decode(value: unknown): DecodeResult<TypeOf<Type[number]>> {
    for (const decoder of this.decoders) {
      const result = decoder.decode(value);
      if (isSuccess(result)) {
        return result;
      }
    }

    return failure([
      {
        message: "Given value is not allow in union",
        name: "union",
        value,
      },
    ]);
  }
}

export const union = <
  Type extends [IDecoder<any>, IDecoder<any>, ...IDecoder<any>[]]
>(
  decoders: Type
) => new UnionDecoder(decoders);
