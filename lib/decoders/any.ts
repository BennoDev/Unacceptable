import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success } from "../result.ts";

class AnyDecoder extends Decoder<any> {
  decode(value: unknown): DecodeResult<any> {
    return success(value);
  }
}

/**
 * Creates a decoder whose result will infer to `any`.
 * This decoder will **always** return a successful result.
 */
export const any = () => new AnyDecoder();
