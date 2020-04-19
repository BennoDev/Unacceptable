import { Decoder } from "../decoder.ts";
import { failure, success } from "../result.ts";

class ObjectDecoder extends Decoder<object> {
  constructor() {
    super(value =>
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? success(value)
        : failure([{ message: "Given value is not an object", value }])
    );
  }
}

export const object = () => new ObjectDecoder();
