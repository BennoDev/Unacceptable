import {
  IDecoder,
  DecodeResult
} from "../types.ts";
import { failure, success } from "../result.ts";

export class BooleanDecoder implements IDecoder<boolean> {
  readonly __TYPE__: boolean = false;

  decode(value: unknown): DecodeResult<boolean> {
    return typeof value !== "boolean"
      ? failure([{ message: "Given value is not a boolean", value }])
      : success(value);
  }
}

export const boolean = () => new BooleanDecoder();
