import { IDecoder, ValidationError, DecodeResult, TypeOf } from "../types.ts";
import { failure, success, isFailure } from "../result.ts";
import { DecoderWithRules } from "../decoder.ts";

class ArrayDecoder<ElementDecoder extends IDecoder<any>>
  extends DecoderWithRules<
    Array<TypeOf<ElementDecoder>>
  > {
  constructor(private readonly elementDecoder: ElementDecoder) {
    super();
  }

  decode(value: unknown): DecodeResult<Array<TypeOf<ElementDecoder>>> {
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
  }

  private decodeElements(value: unknown[]): ValidationError[] {
    return value.reduce<ValidationError[]>((errors, val, index) => {
      const result = this.elementDecoder.decode(val);
      return isFailure(result)
        ? [...errors, ...this.withPath(result.errors, index.toString())]
        : errors;
    }, []);
  }
}

export const array = <ElementDecoder extends IDecoder<any>>(
  decoder: ElementDecoder
) => new ArrayDecoder(decoder);
