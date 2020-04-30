import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success } from "../result.ts";

class AnyDecoder extends Decoder<any> {
  decode(value: unknown): DecodeResult<any> {
    return success(value);
  }
}

export const any = () => new AnyDecoder();
