import { IDecoder, DecodeResult } from "../types.ts";
import { success } from "../result.ts";

class AnyDecoder implements IDecoder<any> {
  readonly __TYPE__!: any;

  decode(value: unknown): DecodeResult<any> {
    return success(value);
  }
}

export const any = () => new AnyDecoder();
