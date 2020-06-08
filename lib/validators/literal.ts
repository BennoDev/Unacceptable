import { Literal, ValidationResult } from "../types.ts";
import { Validator } from "../validator.ts";
import { success, failure } from "../result.ts";

class LiteralValidator<Type extends Literal> extends Validator<Type> {
  constructor(private readonly literal: Type) {
    super();
  }

  validate(value: unknown): ValidationResult<Type> {
    return value === this.literal
      ? success(value as Type)
      : failure([
          {
            message: `Given value ${value} is not equal to expected: ${this.__TYPE__}`,
            name: literal.toString(),
            value,
          },
        ]);
  }
}

/**
 * Creates a validator for a literal value (can be `number | string`). Mostly used in combination with a `union` validator.
 * The value will infer to the given literal.
 * @param value The literal that will be validated against.
 *
 * @example
 * const validator = literal("200");
 * type OkStatusCode = Infer<typeof validator>
 * // OkStatusCode = "200"
 */
export const literal = <Type extends Literal>(value: Type) =>
  new LiteralValidator(value);
