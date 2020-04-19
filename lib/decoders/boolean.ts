import { Decoder } from "../decoder.ts";
import { failure, success } from "../result.ts";

class BooleanDecoder extends Decoder<boolean> {
  constructor() {
    super(value =>
      typeof value !== "boolean"
        ? failure([{ message: "Given value is not a boolean", value }])
        : success(value)
    );
  }
}

export const boolean = () => new BooleanDecoder();
