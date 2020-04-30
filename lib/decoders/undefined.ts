import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { success, failure } from "../result.ts";

class UndefinedDecoder extends Decoder<undefined> {
  decode(value: unknown): DecodeResult<undefined> {
    return typeof value === "undefined"
      ? success(value)
      : failure([{ message: "Given value is not undefined", value }]);
  }
}

export const undefinedDecoder = () => new UndefinedDecoder();
