import { IDecoder, DecodeResult } from "./types.ts";
import { success, failure } from "./result.ts";

class UndefinedDecoder implements IDecoder<undefined> {
  readonly __TYPE__: undefined;

  decode(value: unknown): DecodeResult<undefined> {
    return typeof value === "undefined"
      ? success(value)
      : failure([{ message: "Given value is not undefined", value }]);
  }
}

export const undefinedDecoder = () => new UndefinedDecoder();
