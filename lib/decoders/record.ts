import {
  ICustomizableDecoder,
  ValidationRule,
  DecodeResult,
  IDecoder,
  ValidationError
} from "../types.ts";
import { failure, success, isFailure } from "../result.ts";
import { string } from "./string.ts";

class RecordDecoder<TValue = unknown>
  implements ICustomizableDecoder<Record<string, TValue>> {
  readonly __TYPE__: Record<string, TValue> = {};

  private readonly rules: Array<ValidationRule<Record<string, TValue>>> = [];
  private readonly keyDecoder = string();

  constructor(
    private readonly valueDecoder: IDecoder<TValue>
  ) {}

  withRule(rule: ValidationRule<unknown>): this {
    this.rules.push(rule);
    return this;
  }

  decode(value: unknown): DecodeResult<Record<string, TValue>> {
    if (
      typeof value !== "object" || value === null ||
      Object.keys(value).length === 0
    ) {
      return failure(
        [{ value, message: "Given value is not a non-empty object" }]
      );
    }

    const errors = Object.entries(value).reduce<ValidationError[]>(
      (allErrors, [key, value]) => {
        const keyResult = this.keyDecoder.decode(key);
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

    if (errors.length > 0) {
      return failure(errors);
    }

    return success(value as Record<string, TValue>);
  }
}

export const record = <TValue>(
  valueDecoder: IDecoder<TValue>
) => new RecordDecoder(valueDecoder);
