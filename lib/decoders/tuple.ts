import { ValidationError, TypeOf, IDecoder, DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isSuccess } from "../result.ts";

type TupleDecoders = [IDecoder<any>, ...IDecoder<any>[]];

type TupleType<Type extends TupleDecoders> = {
  [Key in keyof Type]: Type[Key] extends IDecoder<any>
    ? TypeOf<Type[Key]>
    : never;
};

class TupleDecoder<Type extends TupleDecoders> extends Decoder<
  TupleType<Type>
> {
  constructor(readonly decoders: Type) {
    super();
  }

  decode(value: unknown): DecodeResult<TupleType<Type>> {
    if (!Array.isArray(value)) {
      return failure([
        {
          message: "Given value is not an array | tuple",
          name: "tuple",
          value,
        },
      ]);
    }

    if (value.length !== this.decoders.length) {
      return failure([
        {
          message: "Given value is not correct tuple length",
          name: "tuple",
          value,
        },
      ]);
    }

    const errors: ValidationError[] = [];
    const decoded: unknown[] = [];

    for (const [index, decoder] of this.decoders.entries()) {
      const result = decoder.decode(value[index]);
      if (isSuccess(result)) {
        decoded.push(result.value);
      } else {
        errors.push(...this.withPath(result.errors, index.toString()));
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(decoded as TupleType<Type>);
  }
}

export const tuple = <Type extends TupleDecoders>(decoders: Type) =>
  new TupleDecoder(decoders);
