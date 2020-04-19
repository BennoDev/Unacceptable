import { Decoder } from "../decoder.ts";
import { success } from "../result.ts";

class UnknownDecoder extends Decoder<unknown> {
  constructor() {
    super(success);
  }
}

export const unknown = () => new UnknownDecoder();
