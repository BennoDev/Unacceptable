// Types
export {
  ValidationError,
  ValidationRule,
  DecodeResult,
  Infer,
  IDecoder,
} from "./lib/types.ts";

// Decoders
export { isSuccess, isFailure, success, failure } from "./lib/result.ts";
export { Decoder, DecoderWithRules } from "./lib/decoder.ts";

import { any } from "./lib/decoders/any.ts";
import { array } from "./lib/decoders/array.ts";
import { boolean } from "./lib/decoders/boolean.ts";
import { intersection } from "./lib/decoders/intersection.ts";
import { literal } from "./lib/decoders/literal.ts";
import { nullDecoder } from "./lib/decoders/null.ts";
import { number } from "./lib/decoders/number.ts";
import { object } from "./lib/decoders/object.ts";
import { partial } from "./lib/decoders/partial.ts";
import { record } from "./lib/decoders/record.ts";
import { string } from "./lib/decoders/string.ts";
import { tuple } from "./lib/decoders/tuple.ts";
import { type } from "./lib/decoders/type.ts";
import { undefinedDecoder } from "./lib/decoders/undefined.ts";
import { union } from "./lib/decoders/union.ts";
import { unknown } from "./lib/decoders/unknown.ts";

/**
 * Base for all the validators.
 */
export const d = {
  any,
  array,
  boolean,
  intersection,
  literal,
  null: nullDecoder,
  number,
  object,
  partial,
  record,
  string,
  tuple,
  type,
  undefined: undefinedDecoder,
  union,
  unknown,
};
