import { ValidationError, DecodeResult, IDecoder } from "../types.ts";
import { DecoderWithRules } from "../decoder.ts";
import { failure, success, isSuccess } from "../result.ts";

class RecordDecoder<Value = unknown> extends DecoderWithRules<
  Record<string, Value>
> {
  constructor(private readonly valueDecoder: IDecoder<Value>) {
    super();
  }

  decode(value: unknown): DecodeResult<Record<string, Value>> {
    if (
      typeof value !== "object" ||
      value === null ||
      Object.keys(value).length === 0
    ) {
      return failure([
        {
          message: "Given value is not a non-empty object",
          name: "record",
          value,
        },
      ]);
    }

    const decoded: Record<string, Value> = {};
    const shapeErrors: ValidationError[] = [];

    for (const [key, property] of Object.entries(value)) {
      const result = this.valueDecoder.decode(property);
      if (isSuccess(result)) {
        decoded[key] = result.value;
      } else {
        shapeErrors.push(...this.withPath(result.errors, key));
      }
    }

    if (shapeErrors.length > 0) {
      return failure(shapeErrors);
    }

    // From now on we can safely cast to Record<string, Value> since we verified this with `validateRecordShape`.
    const ruleErrors = this.validateRules(decoded);
    if (ruleErrors.length > 0) {
      return failure(ruleErrors);
    }

    return success(decoded);
  }
}

/**
 * Creates a decoder for an object whose keys are not necessarily known, each value will be decoded
 * using the passed decoder argument. For arrays, use the array decoder as arrays will result in a `Failure` result.
 * Infers to a `Record<string, TypeOf<typeof decoder>>`
 * @param valueDecoder Decoder that will be executed for each value in the object.
 * @example
 * const decoder = record(number());
 * type CustomRecord = TypeOf<typeof decoder>;
 * // CustomRecord = Record<string, number>
 */
export const record = <Value>(valueDecoder: IDecoder<Value>) =>
  new RecordDecoder(valueDecoder);
