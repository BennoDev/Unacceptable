import { IDecoder, ValidationError, TypeOf, DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success, isSuccess } from "../result.ts";

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

  decode(value: unknown): DecodeResult<Intersection<TypeOf<Type[number]>>> {
    const errors: ValidationError[] = [];
    const decoded: unknown[] = [];

    for (const decoder of this.decoders) {
      const result = decoder.decode(value);
      if (isSuccess(result)) {
        decoded.push(result.value);
      } else {
        errors.push(...result.errors);
      }
    }

    if (errors.length > 0) {
      return failure(errors);
    }

    // If the value we decoded was a primitive, we can just return it as such, else we need to merge the different decoded values.
    const merged = this.isObject(decoded[0])
      ? this.mergeDecoded(decoded)
      : decoded[0];

    return success(merged as Intersection<TypeOf<Type[number]>>);
  }

  private mergeDecoded(decoded: unknown[]) {
    if (!this.isObject(decoded[0])) {
      return decoded[0];
    }

    // Sets the identity for the return target, based on what was decoded.
    const target = Array.isArray(decoded[0]) ? [] : {};
    // Deep assign each decoded value to the target to get the result.
    for (const one of decoded) {
      this.assign(target, one as object);
    }
    return target;
  }

  private assign(
    target: Record<string, any>,
    source: object
  ): Record<string, unknown> {
    Object.entries(source).forEach(([key, value]) => {
      if (!this.isObject(value)) {
        // if the value is a primitive or null, we can just set the target's key to the value and return.
        target[key] = value;
        return;
      }

      if (Array.isArray(value)) {
        // If the value is an array, and the target's key has not yet been initialized, we do that here.
        if (!Array.isArray(target[key])) {
          target[key] = [];
        }

        value.forEach((element, index) => {
          // If it's a primitive, just set the target's index to the element as there is no need to deep assign.
          if (!this.isObject(element)) {
            target[key][index] = element;
          } else {
            // If the element is an array, and the target hasn't yet initialized the field with an array, we do that here
            if (Array.isArray(element) && !Array.isArray(target[key][index])) {
              target[key][index] = [];
              // If the element is an object, and the target hasn't yet initialized the field with an object, we do that here.
            } else if (!this.isObject(target[key][index])) {
              target[key][index] = {};
            }

            // The field has been initalized, so we can safely deep assign to the element.
            this.assign(target[key][index], element);
          }
          return;
        });
      }

      // Object
      if (!Array.isArray(value) && typeof value === "object") {
        // If the value is an object and has not yet been initialized, we do that here.
        if (!this.isObject(target[key])) {
          target[key] = {};
        }

        // The field has been initalized, so we can safely deep assign to the element.
        this.assign(target[key], value);
      }

      return;
    });

    return target;
  }

  private isObject(value: unknown): value is object {
    return value !== null && typeof value === "object";
  }
}

/**
 * Creates a decoder that requires the decoded value to successfully get decoded in all the given decoders.
 * The resulting value in case of a successful response will be a merge of the result of the individual decoders.
 * This mean that in case of a type/partial decoder, stripped properties will only remain stripped if they were not defined
 * in any of the given decoders.
 * @param decoders List of decoders that will all be executed.
 * @example
 * const decoder = intersection([type({ firstName: string() }), type({ lastName: string() })])
 * type Name = TypeOf<typeof decoder>;
 * // Name = { firstName: string } & { lastName: string } = { firstName: string, lastName: string }
 */
export const intersection = <
  Type extends [IDecoder<any>, IDecoder<any>, ...IDecoder<any>[]]
>(
  decoders: Type
) => new IntersectionDecoder(decoders);
