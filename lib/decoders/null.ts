import { Decoder } from "../decoder.ts";
import { success, failure } from "../result.ts";

class NullDecoder extends Decoder<null> {
  constructor() {
    super(value =>
      value === null
        ? success(value)
        : failure([{ message: "Given value is not null or undefined", value }])
    );
  }
}

export const nullDecoder = () => new NullDecoder();
