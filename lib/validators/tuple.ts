import {
  ValidationError,
  Infer,
  IValidator,
  ValidationResult,
} from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success, isSuccess } from "../result.ts";

type TupleValidators = [IValidator<any>, ...IValidator<any>[]];

type TupleType<Type extends TupleValidators> = {
  [Key in keyof Type]: Type[Key] extends IValidator<any>
    ? Infer<Type[Key]>
    : never;
};

class TupleValidator<Type extends TupleValidators> extends Validator<
  TupleType<Type>
> {
  constructor(readonly validators: Type) {
    super();
  }

  validate(value: unknown): ValidationResult<TupleType<Type>> {
    if (!Array.isArray(value)) {
      return failure([
        {
          message: "Given value is not an array | tuple",
          name: "tuple",
          value,
        },
      ]);
    }

    if (value.length !== this.validators.length) {
      return failure([
        {
          message: "Given value is not correct tuple length",
          name: "tuple",
          value,
        },
      ]);
    }

    const errors: ValidationError[] = [];
    const validated: unknown[] = [];

    for (const [index, validator] of this.validators.entries()) {
      const result = validator.validate(value[index]);
      if (isSuccess(result)) {
        validated.push(result.value);
      } else {
        errors.push(...this.withPath(result.errors, index.toString()));
      }
    }

    return errors.length > 0
      ? failure(errors)
      : success(validated as TupleType<Type>);
  }
}

/**
 * Creates a validator that validates a tuple, where a validator is defined for each index,
 * and the value at every index will be validated using the respective validator.
 * Infers to `[validators[0] | validators[1]]`.
 * @param validators List of validators that will be executed by index.
 * @example
 * const validator = tuple([string(), number()])
 * type Tuple = Infer<typeof validator>
 * // Tuple = [string, number]
 */
export const tuple = <Type extends TupleValidators>(validators: Type) =>
  new TupleValidator(validators);
