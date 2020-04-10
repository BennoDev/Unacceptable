import { IDecoder, DecodeResult } from "../types.ts";
import { success } from "../result.ts";

class UnknownDecoder implements IDecoder<unknown> {
  readonly __TYPE__: unknown;

  decode(value: unknown): DecodeResult<unknown> {
    return success(value);
  }
}

export const unknown = () => new UnknownDecoder();
