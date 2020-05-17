import { IDecoder, ValidationError, TypeOf } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isFailure } from "../result.ts";

type Intersection<Union> = (
  Union extends any ? (k: Union) => void : never
) extends (k: infer I) => void
  ? I
  : never;

class IntersectionDecoder<
  Type extends [IDecoder<any>, IDecoder<any>, ...IDecoder<any>[]]
> extends Decoder<Intersection<TypeOf<Type[number]>>> {
  constructor(private readonly decoders: Type) {
    super();
  }

  decode(value: unknown) {
    const errors: ValidationError[] = [];
    for (let i = 0; i < this.decoders.length; i++) {
      const result = this.decoders[i].decode(value);
      if (isFailure(result)) {
        errors.push(...result.errors);
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(value as Intersection<Type>);
  }
}

export const intersection = <
  Type extends [IDecoder<any>, IDecoder<any>, ...IDecoder<any>[]]
>(
  decoders: Type
) => new IntersectionDecoder(decoders);
