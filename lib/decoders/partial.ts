import {
  DecodeResult,
  IDecoder,
  TypeOf,
  Literal,
  ValidationError,
} from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isSuccess } from "../result.ts";

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
    const decoded: Record<Literal, unknown> = {};
    const errors: ValidationError[] = [];

    for (const [key, decoder] of Object.entries(this.decoders)) {
      if (typeof value[key] !== "undefined") {
        const result = decoder.decode(value[key]);
        if (isSuccess(result)) {
          decoded[key] = result.value;
        } else {
          errors.push(...this.withPath(result.errors, key));
        }
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(decoded as Partial<TypeOfProps<Props>>);
  }
}

/**
 * Decodes a defined object with the given decoders, properties that do not have a decoder defined
 * will be stripped from the result. Infers the result to an object with the shape and the types of the given decoders.
 * Properties that are undefined will not cause the decoding to fail, essentially partial makes each property optional.
 * @param decoders Shape of the object to be decoded, and the decoders for each property.
 * @example
 * const decoder = partial({
 *   name: string(),
 *   age: number(),
 * })
 * type CustomPartial = TypeOf<typeof decoder>;
 * // CustomPartial = { name: string | undefined, age: string | undefined }.
 */
export const partial = <Props extends Record<string, IDecoder<any>>>(
  decoders: Props
) => new PartialDecoder(decoders);
