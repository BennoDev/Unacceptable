import { IDecoder, DecodeResult } from "../types.ts";
import { success, failure } from "../result.ts";

class NullDecoder implements IDecoder<null> {
  readonly __TYPE__: null = null;

  decode(value: unknown): DecodeResult<null> {
    return value === null
      ? success(value)
      : failure([{ message: "Given value is not null or undefined", value }]);
  }
}

export const nullDecoder = () => new NullDecoder();
