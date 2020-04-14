import { IDecoder, DecodeResult, ValidationError, TypeOf } from "../types.ts";
import { failure, isFailure, success } from "../result.ts";

class TupleDecoder<Type extends [
  IDecoder<any>,
  ...IDecoder<any>[]
]> implements IDecoder<Type> {
  readonly __TYPE__!: {
    [Key in keyof Type]: Type[Key] extends IDecoder<any> ? TypeOf<Type[Key]>
      : never;
  };

  constructor(readonly decoders: Type) {}

  decode(value: unknown): DecodeResult<any> {
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
    return errors.length > 0 ? failure(errors) : success(value);
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
  IDecoder<any>,
  ...IDecoder<any>[]
]>(decoders: Type) => new TupleDecoder(decoders);
