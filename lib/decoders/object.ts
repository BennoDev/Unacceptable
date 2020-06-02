import { DecodeResult } from "../types.ts";
import { Decoder } from "../decoder.ts";
import { failure, success } from "../result.ts";

class ObjectDecoder extends Decoder<object> {
  decode(value: unknown): DecodeResult<object> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? success(value)
      : failure([
          { message: "Given value is not an object", name: "object", value },
        ]);
  }
}

/**
 * Creates a decoder for objects, infers to `object`.
 * Will return a failure response for arrays.
 */
export const object = () => new ObjectDecoder();
