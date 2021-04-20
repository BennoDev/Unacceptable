// Types
export type {
  Infer,
  IValidator,
  ValidationError,
  ValidationResult,
  ValidationRule,
} from "./lib/types.ts";

// Validators
export { failure, isFailure, isSuccess, success } from "./lib/result.ts";
export { Validator, ValidatorWithRules } from "./lib/validator.ts";

import { any } from "./lib/validators/any.ts";
import { array } from "./lib/validators/array.ts";
import { boolean } from "./lib/validators/boolean.ts";
import { intersection } from "./lib/validators/intersection.ts";
import { literal } from "./lib/validators/literal.ts";
import { nullValidator } from "./lib/validators/null.ts";
import { number } from "./lib/validators/number.ts";
import { object } from "./lib/validators/object.ts";
import { partial } from "./lib/validators/partial.ts";
import { record } from "./lib/validators/record.ts";
import { string } from "./lib/validators/string.ts";
import { tuple } from "./lib/validators/tuple.ts";
import { type } from "./lib/validators/type.ts";
import { undefinedValidator } from "./lib/validators/undefined.ts";
import { union } from "./lib/validators/union.ts";
import { unknown } from "./lib/validators/unknown.ts";

/**
 * Base for all the validators.
 */
export const v = {
  any,
  array,
  boolean,
  intersection,
  literal,
  null: nullValidator,
  number,
  object,
  partial,
  record,
  string,
  tuple,
  type,
  undefined: undefinedValidator,
  union,
  unknown,
};
