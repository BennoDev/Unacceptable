import { DecoderWithRules } from "../decoder.ts";
import { failure, success } from "../result.ts";

class StringDecoder extends DecoderWithRules<string> {
  constructor() {
    super(value => {
      if (typeof value !== "string") {
        return failure([{ message: "Given value is not a string", value }]);
      }

      const errors = this.validateRules(value);
      return errors.length > 0
        ? failure(errors)
        : success(value);
    });
  }
}

export const string = () => new StringDecoder();
