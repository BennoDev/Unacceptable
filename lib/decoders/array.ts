import { IDecoder, ValidationError } from "../types.ts";
import { failure, success, isFailure } from "../result.ts";
import { DecoderWithRules, Decoder } from "../decoder.ts";

class ArrayDecoder<TElement = unknown> extends DecoderWithRules<TElement[]> {
  /**
   * @param decoder Decoder for the array's elements
   */
  constructor(
    private readonly elementDecoder: Decoder<TElement> | DecoderWithRules<
      TElement
    >
  ) {
    super(value => {
      if (!Array.isArray(value)) {
        return failure([{ message: "Value is not an array", value }]);
      }

      const elementErrors = this.decodeElements(value);
      if (elementErrors.length > 0) {
        return failure(elementErrors);
      }

      const ruleErrors = this.validateRules(value);
      if (ruleErrors.length > 0) {
        return failure(ruleErrors);
      }

      return success(value);
    });
  }

  private decodeElements(value: unknown[]): ValidationError[] {
    return value.reduce<ValidationError[]>((errors, val) => {
      const result = this.elementDecoder.decode(val);
      return isFailure(result) ? [...errors, ...result.errors] : errors;
    }, []);
  }
}

export const array = <TDecode>(decoder: IDecoder<TDecode>) =>
  new ArrayDecoder(decoder);
