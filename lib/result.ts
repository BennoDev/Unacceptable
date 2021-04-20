import {
  Failure,
  Success,
  ValidationError,
  ValidationResult,
} from "./types.ts";

/**
 * Wraps the given value in a `Success` type.
 * @param value The value to wrap.
 */
export const success = <Type = unknown>(value: Type): Success<Type> => ({
  success: true,
  value,
});

/**
 * Wraps the given value in a `Failure` type.
 * @param value The value to wrap.
 */
export const failure = (errors: ValidationError[]): Failure => ({
  success: false,
  errors,
});

/**
 * Checks if the result of a validator is a success.
 * @param result Result of a validator
 */
export const isSuccess = <Type>(
  result: ValidationResult<Type>,
): result is Success<Type> => result.success;

/**
 * Checks if the result of a validator is a failure.
 * @param result Result of a validator
 */
export const isFailure = (result: ValidationResult): result is Failure =>
  !result.success;
