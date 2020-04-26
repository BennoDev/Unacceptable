import { ValidationError, Success, Failure, DecodeResult } from "./types.ts";

export const success = <Type = unknown>(val: Type): Success<
  Type
> => ({ success: true, value: val });

export const failure = (
  errors: ValidationError[]
): Failure => ({ success: false, errors });

export const isSuccess = <Type>(result: DecodeResult<Type>): result is Success<
  Type
> => result.success;

export const isFailure = (result: DecodeResult): result is Failure =>
  !result.success;
