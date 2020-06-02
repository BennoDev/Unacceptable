import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success } from "../result.ts";

class UnknownDecoder extends Decoder<unknown> {
  decode(value: unknown): DecodeResult<unknown> {
    return success(value);
  }
}

/**
 * Creates a decoder whose result will infer to `unknown`.
 * This decoder will **always** return a successful result.
 */
export const unknown = () => new UnknownDecoder();
