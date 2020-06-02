import { IDecoder, ValidationError, DecodeResult, Infer } from "../types.ts";
import { failure, success, isFailure, isSuccess } from "../result.ts";
import { DecoderWithRules } from "../decoder.ts";

class ArrayDecoder<
  ElementDecoder extends IDecoder<any>
> extends DecoderWithRules<Array<Infer<ElementDecoder>>> {
  constructor(private readonly elementDecoder: ElementDecoder) {
    super();
  }

  decode(value: unknown): DecodeResult<Array<Infer<ElementDecoder>>> {
    if (!Array.isArray(value)) {
      return failure([{ message: "Value is not an array", value }]);
    }

    const decodedElements: Array<Infer<ElementDecoder>> = [];
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

/**
 * Creates a decoder for an array, type will infer to `Array<TypeOfDecoder>` depending on the decoder passed as argument
 * @param decoder Decoder for the array's elements, will be invoked for each.
 */
export const array = <ElementDecoder extends IDecoder<any>>(
  decoder: ElementDecoder
) => new ArrayDecoder(decoder);
