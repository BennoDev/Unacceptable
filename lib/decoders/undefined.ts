import { Decoder } from "../decoder.ts";
import { success, failure } from "../result.ts";

class UndefinedDecoder extends Decoder<undefined> {
  constructor() {
    super(value =>
      typeof value === "undefined"
        ? success(value)
        : failure([{ message: "Given value is not undefined", value }])
    );
  }
}

export const undefinedDecoder = () => new UndefinedDecoder();
