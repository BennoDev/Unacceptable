import { IDecoder, ValidationError, DecodeResult, TypeOf } from "../types.ts";
import { failure, success, isFailure, isSuccess } from "../result.ts";
import { DecoderWithRules } from "../decoder.ts";

class ArrayDecoder<
  ElementDecoder extends IDecoder<any>
> extends DecoderWithRules<Array<TypeOf<ElementDecoder>>> {
  constructor(private readonly elementDecoder: ElementDecoder) {
    super();
  }

  decode(value: unknown): DecodeResult<Array<TypeOf<ElementDecoder>>> {
    if (!Array.isArray(value)) {
      return failure([{ message: "Value is not an array", value }]);
    }

    const decodedElements: Array<TypeOf<ElementDecoder>> = [];
    const elementErrors: ValidationError[] = [];

    for (const [index, element] of value.entries()) {
      const result = this.elementDecoder.decode(element);
      if (isSuccess(result)) {
        decodedElements.push(result.value);
      } else {
        elementErrors.push(...this.withPath(result.errors, index.toString()));
      }
    }

    if (elementErrors.length > 0) {
      return failure(elementErrors);
    }

    const ruleErrors = this.validateRules(decodedElements);
    if (ruleErrors.length > 0) {
      return failure(ruleErrors);
    }

    return success(decodedElements);
  }
}

export const array = <ElementDecoder extends IDecoder<any>>(
  decoder: ElementDecoder
) => new ArrayDecoder(decoder);
