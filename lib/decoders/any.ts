import { Decoder } from "../decoder.ts";
import { success } from "../result.ts";

class AnyDecoder extends Decoder<any> {
  constructor() {
    super(success);
  }
}

export const any = () => new AnyDecoder();
