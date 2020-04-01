import {
  ICustomizableDecoder,
  ValidationRule,
  DecodeResult,
  IDecoder,
  ValidationError
} from "./types.ts";
import { failure, success } from "./result.ts";

type RecordKey = string | number | symbol;

class RecordDecoder<TKey extends RecordKey, TValue = unknown>
  implements ICustomizableDecoder<Record<TKey, TValue>> {
  private rules: Array<ValidationRule<Record<TKey, TValue>>> = [];

  constructor(
    private readonly keyDecoder: IDecoder<TKey>,
    private readonly valueDecoder: IDecoder<TValue>
  ) {}

  withRule(rule: ValidationRule<unknown>): this {
    this.rules.push(rule);
    return this;
  }

  decode(value: unknown): DecodeResult<Record<TKey, TValue>> {
    if (
      typeof value !== "object" || value === null ||
      Object.keys(value).length === 0
    ) {
      return failure(
        [{ value, message: "Given value is not a non-empty object" }]
      );
    }

    const errors = Object.entries(value).map(([key, value]) =>
      ([
        this.keyDecoder.decode(key),
        this.valueDecoder.decode(value)
      ])
    );

    if (errors.length > 0) {
      return failure();
    }
    // Decode all object keys
    // Decode all object values
    // Probably do it per entry and shape the message as such
  }

  private validateRules(): ValidationError<Record<TKey, TValue>> {}
}

export const record = <TKey extends RecordKey, TValue>(
  keyDecoder: IDecoder<TKey>,
  valueDecoder: IDecoder<TValue>
) => new RecordDecoder(keyDecoder, valueDecoder);
