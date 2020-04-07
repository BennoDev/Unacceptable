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

  withRule(rule: ValidationRule<Record<string, TValue>>): this {
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

  private validateRules(value: Record<string, TValue>): ValidationError[] {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule(value);
      return error ? [...errors, { message: error, value: value }] : errors;
    }, []);
  }

  private validateRecordShape(value: object): ValidationError[] {
    return Object.entries(value).reduce<ValidationError[]>(
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
  }
}

export const record = <TValue>(
  valueDecoder: IDecoder<TValue>
) => new RecordDecoder(valueDecoder);
