import {
  DecodeResult,
  IDecoder,
  ValidationError,
  Literal,
  TypeOf,
} from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isFailure } from "../result.ts";

type TypeOfProps<Props extends Record<string, IDecoder<any>>> = {
  [Key in keyof Props]: TypeOf<Props[Key]>;
};

class TypeDecoder<Props extends Record<string, IDecoder<any>>> extends Decoder<
  // Can't use TypeOfProps here, as this type is treated different as an inline type declaration and results in incorrect inferrence
  {
    [Key in keyof Props]: TypeOf<Props[Key]>;
  }
> {
  constructor(private readonly decoders: Props) {
    super();
  }

  decode(value: unknown): DecodeResult<TypeOfProps<Props>> {
    if (typeof value !== "object" || value === null) {
      return failure([
        { message: "Given value is not an object", name: "object", value },
      ]);
    }

    return this.decodeObject(value as Record<Literal, unknown>);
  }

  private decodeObject(
    value: Record<Literal, unknown>
  ): DecodeResult<TypeOfProps<Props>> {
    const clone: Record<Literal, unknown> = {};
    const errors: ValidationError[] = [];

    for (const [key, decoder] of Object.entries(this.decoders)) {
      const result = decoder.decode(value[key]);
      if (isFailure(result)) {
        errors.push(...this.withPath(result.errors, key));
      } else {
        clone[key] = result.value;
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(clone as TypeOfProps<Props>);
  }
}

export const type = <Props extends Record<string, IDecoder<any>>>(
  decoders: Props
) => new TypeDecoder(decoders);
