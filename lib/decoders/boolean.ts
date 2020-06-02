import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success } from "../result.ts";

class BooleanDecoder extends Decoder<boolean> {
  decode(value: unknown): DecodeResult<boolean> {
    return typeof value !== "boolean"
      ? failure([
          { message: "Given value is not a boolean", name: "boolean", value },
        ])
      : success(value);
  }
}

/**
 * Creates a decoder for boolean types, infers to `boolean`.
 */
export const boolean = () => new BooleanDecoder();
