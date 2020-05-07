import { ValidationError, DecodeResult, IDecoder } from "../types.ts";
import { DecoderWithRules } from "../decoder.ts";
import { failure, success, isFailure } from "../result.ts";
import { string } from "./string.ts";

class RecordDecoder<TValue = unknown> extends DecoderWithRules<
  Record<string, TValue>
> {
  constructor(private readonly valueDecoder: IDecoder<TValue>) {
    super();
  }

  decode(value: unknown): DecodeResult<Record<string, TValue>> {
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

    const recordShapeErrors = this.validateRecordShape(value);
    if (recordShapeErrors.length > 0) {
      return failure(recordShapeErrors);
    }

    // From now on we can safely cast to Record<string, TValue> since we verified this with `validateRecordShape`.
    const ruleErrors = this.validateRules(value as Record<string, TValue>);
    if (ruleErrors.length > 0) {
      return failure(ruleErrors);
    }

    return success(value as Record<string, TValue>);
  }

  private validateRecordShape(value: object): ValidationError[] {
    const keyDecoder = string();
    return Object.entries(value).reduce<ValidationError[]>(
      (allErrors, [key, value]) => {
        const keyResult = keyDecoder.decode(key);
        if (isFailure(keyResult)) {
          allErrors.push(...keyResult.errors);
        }

        const valueResult = this.valueDecoder.decode(value);
        if (isFailure(valueResult)) {
          allErrors.push(...valueResult.errors);
        }

        return allErrors;
      },
      []
    );
  }
}

export const record = <TValue>(valueDecoder: IDecoder<TValue>) =>
  new RecordDecoder(valueDecoder);
