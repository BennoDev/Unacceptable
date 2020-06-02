import { DecodeResult } from "../types.ts";
import { DecoderWithRules } from "../decoder.ts";
import { failure, success } from "../result.ts";

class NumberDecoder extends DecoderWithRules<number> {
  decode(value: unknown): DecodeResult<number> {
    if (typeof value !== "number") {
      return failure([
        { message: "Given value is not a valid number", name: "number", value },
      ]);
    }

    const errors = this.validateRules(value);
    return errors.length > 0 ? failure(errors) : success(value);
  }
}

/**
 * Creates a decoder for numbers, infers to `number`.
 */
export const number = () => new NumberDecoder();
