import {
  DecodeResult,
  IDecoder,
  TypeOf,
  Literal,
  ValidationError,
} from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isFailure } from "../result.ts";

type TypeOfProps<Props extends Record<string, IDecoder<any>>> = {
  [Key in keyof Props]: TypeOf<Props[Key]>;
};

class PartialDecoder<
  Props extends Record<string, IDecoder<any>>
> extends Decoder<
  // Can't use TypeOfProps here, as this type is treated different as an inline type declaration and results in incorrect inferrence
  {
    [Key in keyof Props]?: TypeOf<Props[Key]>;
  }
> {
  constructor(private readonly decoders: Props) {
    super();
  }

  decode(value: unknown): DecodeResult<Partial<TypeOfProps<Props>>> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return failure([
        { message: "Given value is not an object", name: "object", value },
      ]);
    }

    return this.decodeObject(value as Record<Literal, unknown>);
  }

  private decodeObject(
    value: Record<Literal, unknown>
  ): DecodeResult<Partial<TypeOfProps<Props>>> {
    const clone: Record<Literal, unknown> = {};
    const errors: ValidationError[] = [];

    for (const [key, decoder] of Object.entries(this.decoders)) {
      if (typeof value[key] !== "undefined") {
        const result = decoder.decode(value[key]);
        if (isFailure(result)) {
          errors.push(...this.withPath(result.errors, key));
        } else {
          clone[key] = value;
        }
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(clone as Partial<TypeOfProps<Props>>);
  }
}

export const partial = <Props extends Record<string, IDecoder<any>>>(
  decoders: Props
) => new PartialDecoder(decoders);
