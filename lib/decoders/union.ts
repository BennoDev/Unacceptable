import { IDecoder, DecodeResult, TypeOf } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success, failure, isSuccess } from "../result.ts";

class UnionDecoder<
  Type extends [
    IDecoder<any>,
    IDecoder<any>,
    ...IDecoder<any>[]
  ]
> extends Decoder<TypeOf<Type[number]>> {
  constructor(
    private readonly decoders: Type
  ) {
    super();
  }

  decode(value: unknown): DecodeResult<TypeOf<Type[number]>> {
    return !this.isValid(value)
      ? failure(
        [{ message: "Given value is not allow in union", value }]
      )
      : success(value as TypeOf<Type[number]>);
  }

  private isValid(value: unknown): boolean {
    for (var i = 0; i < this.decoders.length; i++) {
      if (isSuccess(this.decoders[i].decode(value))) {
        return true;
      }
    }

    return false;
  }
}

export const union = <
  Type extends [
    IDecoder<any>,
    IDecoder<any>,
    ...IDecoder<any>[]
  ]
>(decoders: Type) => new UnionDecoder(decoders);
