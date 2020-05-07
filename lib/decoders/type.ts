import { DecodeResult, IDecoder, ValidationError, Literal } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isFailure } from "../result.ts";

class TypeDecoder<Type extends Record<string, IDecoder<any>>> extends Decoder<
  Type
> {
  constructor(private readonly decoders: Type) {
    super();
  }

  decode(value: unknown): DecodeResult<Type> {
    if (typeof value !== "object" || value === null) {
      return failure([{ message: "Hey", value }]);
    }

    return this.decodeObject(value as Record<Literal, unknown>);
  }

  private decodeObject(value: Record<Literal, unknown>): DecodeResult<Type> {
    const clone: Record<Literal, unknown> = {};
    const errors: ValidationError[] = [];

    for (const [key, decoder] of Object.entries(this.decoders)) {
      const result = decoder.decode(value[key]);
      if (isFailure(result)) {
        errors.push(...result.errors);
      } else {
        clone[key] = result.value;
      }
    }

    return errors.length > 0 ? failure(errors) : success(clone as Type);
  }
}

export const type = <Type extends Record<string, IDecoder<any>>>(
  decoders: Type
) => new TypeDecoder(decoders);

/**
 * Type IN -> Type OUT
 * 1. Strip properties without decoders
 * 2. Validate given decoders for remaining fields
 * 3. Return formatted error messages
 *
 * Error messages revision.
 * Provide parentKey for every error message? I think so
 * {
 *   name: []
 * }
 *
 * -> [
 *   {
 *     key: name,
 *     parent: hey,
 *     value: bye,
 *     errors: hey
 *   }
 * ]
 */
