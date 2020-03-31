import { IDecoder, DecodeResult } from "./types.ts";
import { success, failure } from "./result.ts";

type Nullish = undefined | null;

class NullishDecoder implements IDecoder<Nullish> {
  decode(value: unknown): DecodeResult<Nullish> {
    return typeof value === "undefined" || value === null
      ? success(value)
      : failure([{ message: "Given value is not null or undefined", value }]);
  }
}

export const nullish = () => new NullishDecoder();
