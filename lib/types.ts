export type Literal = string | number;

/**
 * A validation rule is a constraint that can be added to certain validators, and will be executed on each `validate` call.
 * Important to note is that rules will fire **after** basic validation (type of data mostly) has been completed.
 * This means we can safely assume the value in the rule's function is already of the correct type, it also means the rule will
 * not be fired, if the basic validation failed.
 *
 * @example
 * const rule: ValidationRule<number> = {
 *   name: "IsPositive",
 *   fn: (value: number) => {
 *     return value > 0 ? null : "Given number is not positive";
 *   }
 * }
 */
export type ValidationRule<Type = unknown> = {
  /**
   * Name for the rule (choosing a somewhat unique one will make error messages more descriptive).
   */
  name: string;
  /**
   * Function that will be executed when a value is being validated.
   * A rule needs to return a `string` in case the rule failed, this string will be the error message for this rule.
   * If the rule has been passed successfully, it needs to return `null`.
   * @param value The value that is being validated.
   */
  fn: (value: Type) => string | null;
};

export type ValidationError = {
  /**
   * Value that failed validation.
   */
  value: unknown;

  /**
   * Error message for failed rules.
   */
  message: string;

  /**
   * Name of the rule that failed.
   */
  name?: string;

  /**
   * Full path of the key relative to the root that is being validated.
   */
  path?: string[];
};

/**
 * Represents a successful ValidationResult.
 */
export type Success<Type> = {
  /**
   * Success flag.
   */
  readonly success: true;
  /**
   * Resulting value from the validator.
   */
  readonly value: Type;
};

/**
 * Represents a failed ValidationResult.
 */
export type Failure = {
  /**
   * Success flag.
   */
  readonly success: false;
  /**
   * List of errors from the validator (and any nested validators that were called).
   */
  readonly errors: ValidationError[];
};

/**
 * Result of a value that got validated, can be either `Success` or `Failure`.
 * Use `isSuccess(result) | isFailure(result)` to narrow down.
 */
export type ValidationResult<Type = unknown> = Success<Type> | Failure;

/**
 * Base interface for all validators, can be implemented to make new validators.
 */
export interface IValidator<Type> {
  /**
   * Avoid using directly, this is the underlying type that is used for
   * type inferrence. To infer use the `Infer<T>` type.
   */
  readonly __TYPE__: Type;

  /**
   * Validates a value and returns a result.
   * @param value Value to validate
   */
  validate: (value: unknown) => ValidationResult<Type>;
}

/**
 * Infers a static type from the given validator.
 */
export type Infer<Validator extends IValidator<any>> = Validator["__TYPE__"];
