import { DecodeResult } from "../types.ts";
import { DecoderWithRules } from "../decoder.ts";
import { failure, success } from "../result.ts";

class StringDecoder extends DecoderWithRules<string> {
  decode(value: unknown): DecodeResult<string> {
    if (typeof value !== "string") {
      return failure([
        { message: "Given value is not a string", name: "string", value },
      ]);
    }

    const errors = this.validateRules(value);
    return errors.length > 0 ? failure(errors) : success(value);
  }
}

/**
 * Creates a decoder for strings, infers to `string`.
 */
export const string = () => new StringDecoder();
