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

    const merged =
      typeof decoded[0] === "object" && decoded !== null
        ? this.mergeDecoded(decoded)
        : decoded[0];

    return success(merged as Intersection<TypeOf<Type[number]>>);
  }

  private mergeDecoded(decoded: unknown[]) {
    if (decoded[0] === null || typeof decoded[0] !== "object") {
      return decoded[0];
    }

    const target = Array.isArray(decoded[0]) ? [] : {};
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
      // Primitive or null
      if (value === null || typeof value !== "object") {
        target[key] = value;
        return;
      }

      // Array
      if (Array.isArray(value)) {
        if (!Array.isArray(target[key])) {
          target[key] = [];
        }

        value.forEach((element, index) => {
          if (element === null || typeof element !== "object") {
            target[key][index] = element;
          } else {
            if (Array.isArray(element) && !Array.isArray(target[key][index])) {
              target[key][index] = [];
            } else if (
              target[key][index] === null ||
              typeof target[key][index] !== "object"
            ) {
              target[key][index] = {};
            }

            this.assign(target[key][index], element);
          }
          return;
        });
      }

      // Object
      if (!Array.isArray(value) && typeof value === "object") {
        if (target[key] === null || typeof target[key] !== "object") {
          target[key] = {};
        }
        this.assign(target[key], value);
      }

      return;
    });

    return target;
  }
}

export const intersection = <
  Type extends [IDecoder<any>, IDecoder<any>, ...IDecoder<any>[]]
>(
  decoders: Type
) => new IntersectionDecoder(decoders);
