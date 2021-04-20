import { IValidator, ValidationError, ValidationResult } from "../types.ts";
import { ValidatorWithRules } from "../validator.ts";
import { failure, isSuccess, success } from "../result.ts";

class RecordValidator<Value = unknown> extends ValidatorWithRules<
  Record<string, Value>
> {
  constructor(private readonly valueValidator: IValidator<Value>) {
    super();
  }

  validate(value: unknown): ValidationResult<Record<string, Value>> {
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

    const validated: Record<string, Value> = {};
    const shapeErrors: ValidationError[] = [];

    for (const [key, property] of Object.entries(value)) {
      const result = this.valueValidator.validate(property);
      if (isSuccess(result)) {
        validated[key] = result.value;
      } else {
        shapeErrors.push(...this.withPath(result.errors, key));
      }
    }

    if (shapeErrors.length > 0) {
      return failure(shapeErrors);
    }

    // From now on we can safely cast to Record<string, Value> since we verified this with `validateRecordShape`.
    const ruleErrors = this.validateRules(validated);
    if (ruleErrors.length > 0) {
      return failure(ruleErrors);
    }

    return success(validated);
  }
}

/**
 * Creates a validator for an object whose keys are not necessarily known, each value will be validated
 * using the passed validator argument. For arrays, use the array validator as arrays will result in a `Failure` result.
 * Infers to a `Record<string, Infer<typeof validator>>`
 * @param valueValidator Validator that will be executed for each value in the object.
 * @example
 * const validator = record(number());
 * type CustomRecord = Infer<typeof validator>;
 * // CustomRecord = Record<string, number>
 */
export const record = <Value>(valueValidator: IValidator<Value>) =>
  new RecordValidator(valueValidator);
