import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success, failure } from "../result.ts";

class NullDecoder extends Decoder<null> {
  decode(value: unknown): DecodeResult<null> {
    return value === null
      ? success(value)
      : failure([{ message: "Given value is not null or undefined", value }]);
  }
}

export const nullDecoder = () => new NullDecoder();
