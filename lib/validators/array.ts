import {
  Infer,
  IValidator,
  ValidationError,
  ValidationResult,
} from "../types.ts";
import { failure, isSuccess, success } from "../result.ts";
import { ValidatorWithRules } from "../validator.ts";

class ArrayValidator<
  ElementValidator extends IValidator<any>,
> extends ValidatorWithRules<Array<Infer<ElementValidator>>> {
  constructor(private readonly elementValidator: ElementValidator) {
    super();
  }

  validate(value: unknown): ValidationResult<Array<Infer<ElementValidator>>> {
    if (!Array.isArray(value)) {
      return failure([{ message: "Value is not an array", value }]);
    }

    const validatedElements: Array<Infer<ElementValidator>> = [];
    const elementErrors: ValidationError[] = [];

    for (const [index, element] of value.entries()) {
      const result = this.elementValidator.validate(element);
      if (isSuccess(result)) {
        validatedElements.push(result.value);
      } else {
        elementErrors.push(...this.withPath(result.errors, index.toString()));
      }
    }

    if (elementErrors.length > 0) {
      return failure(elementErrors);
    }

    const ruleErrors = this.validateRules(validatedElements);
    if (ruleErrors.length > 0) {
      return failure(ruleErrors);
    }

    return success(validatedElements);
  }
}

/**
 * Creates a validator for an array, type will infer to `Array<TypeOfValidator>` depending on the validator passed as argument
 * @param validator Validator for the array's elements, will be invoked for each.
 */
export const array = <ElementValidator extends IValidator<any>>(
  validator: ElementValidator,
) => new ArrayValidator(validator);
