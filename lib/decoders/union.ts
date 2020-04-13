import { IDecoder, DecodeResult, TypeOf } from "../types.ts";
import { success, failure, isSuccess } from "../result.ts";

class UnionDecoder<
  Type extends [
    IDecoder<any>,
    IDecoder<any>,
    ...IDecoder<any>[]
  ]
> implements IDecoder<TypeOf<Type[number]>> {
  readonly __TYPE__!: TypeOf<Type[number]>;

  constructor(
    private readonly decoders: Type
  ) {}

  decode(value: unknown): DecodeResult<TypeOf<Type[number]>> {
    if (!this.isValid(value)) {
      return failure([{ message: "", value }]);
    }

    return success(value as TypeOf<Type[number]>);
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
