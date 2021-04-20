import { Infer, IValidator, ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, isSuccess } from "../result.ts";

/**
 * Returns result of first validator
 */
class UnionValidator<
  Type extends [IValidator<any>, IValidator<any>, ...IValidator<any>[]],
> extends Validator<Infer<Type[number]>> {
  constructor(private readonly validators: Type) {
    super();
  }

  validate(value: unknown): ValidationResult<Infer<Type[number]>> {
    for (const validator of this.validators) {
      const result = validator.validate(value);
      if (isSuccess(result)) {
        return result;
      }
    }

    return failure([
      {
        message: "Given value is not allow in union",
        name: "union",
        value,
      },
    ]);
  }
}

/**
 * Creates a validator that requires the validated value to result in `Success`
 * in atleast one of the passed validators. The response will be the result of the first successful validate or a failure if none
 * were successful.
 * @param validators List of validators that will can be run
 * @example
 * const validator = union([literal("401"), literal("404")]);
 * type ErrorCodes = Infer<typeof validator>;
 * // ErrorCodes = "401" | "404"
 */
export const union = <
  Type extends [IValidator<any>, IValidator<any>, ...IValidator<any>[]],
>(
  validators: Type,
) => new UnionValidator(validators);
