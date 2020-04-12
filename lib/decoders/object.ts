import { IDecoder, DecodeResult } from "../types.ts";
import { failure, success } from "../result.ts";

class ObjectDecoder implements IDecoder<object> {
  readonly __TYPE__!: object;

  decode(value: unknown): DecodeResult<object> {
    return typeof value === "object" && value !== null
      ? success(value)
      : failure([{ message: "Given value is not an object", value }]);
  }
}

export const object = () => new ObjectDecoder();
