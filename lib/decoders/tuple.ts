import { ValidationError, TypeOf, IDecoder } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, isFailure, success } from "../result.ts";

type TupleDecoders = [
  IDecoder<any>,
  ...IDecoder<any>[]
];

type TupleType<Type extends TupleDecoders> = {
  [Key in keyof Type]: Type[Key] extends IDecoder<any> ? TypeOf<Type[Key]>
    : never;
};

class TupleDecoder<Type extends TupleDecoders>
  extends Decoder<TupleType<Type>> {
  constructor(readonly decoders: Type) {
    super(value => {
      if (!Array.isArray(value)) {
        return failure(
          [{ message: "Given value is not an array | tuple", value }]
        );
      }

      if (value.length !== this.decoders.length) {
        return failure(
          [{ message: "Given value is correct tuple length", value }]
        );
      }

      const errors = this.decodeElements(value);
      return errors.length > 0
        ? failure(errors)
        : success(value as TupleType<Type>);
    });
  }

  private decodeElements(value: unknown[]): ValidationError[] {
    const errors: ValidationError[] = [];

    for (let i = 0; i < this.decoders.length; i++) {
      const result = this.decoders[i].decode(value[i]);
      if (isFailure(result)) {
        errors.push(...result.errors);
      }
    }

    return errors;
  }
}

export const tuple = <Type extends [
  Decoder<any>,
  ...Decoder<any>[]
]>(decoders: Type) => new TupleDecoder(decoders);
