import { DecoderWithRules } from "../decoder.ts";
import { failure, success } from "../result.ts";

class NumberDecoder extends DecoderWithRules<number> {
  constructor() {
    super(value => {
      if (typeof value !== "number") {
        return failure(
          [{ message: "Given value is not a valid number", value }]
        );
      }

      const errors = this.validateRules(value);
      return errors.length > 0
        ? failure(errors)
        : success(value);
    });
  }
}

export const number = () => new NumberDecoder();
