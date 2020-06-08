import {
  IValidator,
  ValidationError,
  Infer,
  ValidationResult,
} from "../types.ts";
import { Validator } from "../validator.ts";
import { failure, success, isSuccess } from "../result.ts";

type Intersection<Union> = (
  Union extends any ? (k: Union) => void : never
) extends (k: infer I) => void
  ? I
  : never;

class IntersectionValidator<
  Type extends [IValidator<any>, IValidator<any>, ...IValidator<any>[]]
> extends Validator<Intersection<Infer<Type[number]>>> {
  constructor(private readonly validators: Type) {
    super();
  }

  validate(
    value: unknown
  ): ValidationResult<Intersection<Infer<Type[number]>>> {
    const errors: ValidationError[] = [];
    const validated: unknown[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(value);
      if (isSuccess(result)) {
        validated.push(result.value);
      } else {
        errors.push(...result.errors);
      }
    }

    if (errors.length > 0) {
      return failure(errors);
    }

    // If the value we validated was a primitive, we can just return it as such, else we need to merge the different validated values.
    const merged = this.isObject(validated[0])
      ? this.mergeValidated(validated)
      : validated[0];

    return success(merged as Intersection<Infer<Type[number]>>);
  }

  private mergeValidated(validated: unknown[]) {
    if (!this.isObject(validated[0])) {
      return validated[0];
    }

    // Sets the identity for the return target, based on what was validated.
    const target = Array.isArray(validated[0]) ? [] : {};
    // Deep assign each validated value to the target to get the result.
    for (const one of validated) {
      this.assign(target, one as object);
    }
    return target;
  }

  private assign(
    target: Record<string, any>,
    source: object
  ): Record<string, unknown> {
    Object.entries(source).forEach(([key, value]) => {
      if (!this.isObject(value)) {
        // if the value is a primitive or null, we can just set the target's key to the value and return.
        target[key] = value;
        return;
      }

      if (Array.isArray(value)) {
        // If the value is an array, and the target's key has not yet been initialized, we do that here.
        if (!Array.isArray(target[key])) {
          target[key] = [];
        }

        value.forEach((element, index) => {
          // If it's a primitive, just set the target's index to the element as there is no need to deep assign.
          if (!this.isObject(element)) {
            target[key][index] = element;
          } else {
            // If the element is an array, and the target hasn't yet initialized the field with an array, we do that here
            if (Array.isArray(element) && !Array.isArray(target[key][index])) {
              target[key][index] = [];
              // If the element is an object, and the target hasn't yet initialized the field with an object, we do that here.
            } else if (!this.isObject(target[key][index])) {
              target[key][index] = {};
            }

            // The field has been initalized, so we can safely deep assign to the element.
            this.assign(target[key][index], element);
          }
          return;
        });
      }

      if (!Array.isArray(value) && typeof value === "object") {
        // If the value is an object and has not yet been initialized, we do that here.
        if (!this.isObject(target[key])) {
          target[key] = {};
        }

        // The field has been initalized, so we can safely deep assign to the element.
        this.assign(target[key], value);
      }

      return;
    });

    return target;
  }

  private isObject(value: unknown): value is object {
    return value !== null && typeof value === "object";
  }
}

/**
 * Creates a validator that requires the validated value to successfully get validated in all the given validators.
 * The resulting value in case of a successful response will be a merge of the result of the individual validators.
 * This mean that in case of a type/partial validator, stripped properties will only remain stripped if they were not defined
 * in any of the given validators.
 * @param validators List of validators that will all be executed.
 * @example
 * const validator = intersection([type({ firstName: string() }), type({ lastName: string() })])
 * type Name = Infer<typeof validator>;
 * // Name = { firstName: string } & { lastName: string } = { firstName: string, lastName: string }
 */
export const intersection = <
  Type extends [IValidator<any>, IValidator<any>, ...IValidator<any>[]]
>(
  validators: Type
) => new IntersectionValidator(validators);
