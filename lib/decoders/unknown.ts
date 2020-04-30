import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success } from "../result.ts";

class UnknownDecoder extends Decoder<unknown> {
  decode(value: unknown): DecodeResult<unknown> {
    return success(value);
  }
}

export const unknown = () => new UnknownDecoder();
