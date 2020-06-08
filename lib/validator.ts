import {
  ValidationRule,
  ValidationError,
  IValidator,
  ValidationResult,
} from "./types.ts";

export abstract class Validator<Type> implements IValidator<Type> {
  readonly __TYPE__!: Type;

  abstract validate(value: unknown): ValidationResult<Type>;

  /**
   * Adds context to the given errors.
   * @param errors Errors to enrich
   * @param part Part of the path, essentially context for the error
   */
  protected withPath(
    errors: ValidationError[],
    part: string
  ): ValidationError[] {
    const errorswithPath: ValidationError[] = [];

    for (const error of errors) {
      const path = Array.isArray(error.path) ? [part, ...error.path] : [part];
      errorswithPath.push({ ...error, path });
    }

    return errorswithPath;
  }
}

export abstract class ValidatorWithRules<Type> implements IValidator<Type> {
  readonly __TYPE__!: Type;

  private rules: Array<ValidationRule<Type>> = [];

  abstract validate(value: unknown): ValidationResult<Type>;

  /**
   * Adds a validation rule to the validator to be executed on each validate call.
   * @param rule The new rule
   */
  withRule(rule: ValidationRule<Type>): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * Passes the value though all the rules in this validator.
   * @param value The value to validate
   */
  protected validateRules(value: Type) {
    return this.rules.reduce<ValidationError[]>((errors, rule) => {
      const error = rule.fn(value);
      return error
        ? [...errors, { message: error, value: value, name: rule.name }]
        : errors;
    }, []);
  }

  /**
   * Adds context to the given errors.
   * @param errors Errors to enrich
   * @param part Part of the path, essentially context for the error
   */
  protected withPath(
    errors: ValidationError[],
    part: string
  ): ValidationError[] {
    const errorswithPath: ValidationError[] = [];

    for (const error of errors) {
      const path = Array.isArray(error.path) ? [part, ...error.path] : [part];
      errorswithPath.push({ ...error, path });
    }

    return errorswithPath;
  }
}
