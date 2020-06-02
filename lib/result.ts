import { ValidationError, Success, Failure, DecodeResult } from "./types.ts";

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
 * Checks if the result of a decoder is a success.
 * @param result Result of a decoder
 */
export const isSuccess = <Type>(
  result: DecodeResult<Type>
): result is Success<Type> => result.success;

/**
 * Checks if the result of a decoder is a failure.
 * @param result Result of a decoder
 */
export const isFailure = (result: DecodeResult): result is Failure =>
  !result.success;
