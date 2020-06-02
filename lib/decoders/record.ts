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

export const record = <Value>(valueDecoder: IDecoder<Value>) =>
  new RecordDecoder(valueDecoder);
