import {
  IDecoder,
  DecodeResult,
  ValidationRule,
  ValidationError,
  ICustomizableDecoder
} from "./types.ts";
import { failure, success, isFailure } from "./result.ts";

class ArrayDecoder<TElement = unknown>
  implements ICustomizableDecoder<TElement[]> {
  readonly __TYPE__: TElement[];

  private rules: Array<ValidationRule<TElement[]>> = [];

  /**
   * @param decoder Decoder for the array's elements
   */
  constructor(private readonly elementDecoder: IDecoder<TElement>) {}

  decode(value: unknown): DecodeResult<TElement[]> {
    if (!Array.isArray(value)) {
      return failure([{ message: "Value is not an array", value }]);
    }

    const errors = this.decodeElements(value);
    return errors.length > 0 ? failure(errors) : success(value);
  }

  withRule(rule: ValidationRule<unknown>): this {
    this.rules.push(rule);
    return this;
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
