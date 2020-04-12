type ValidationRuleResult = string | null;

export type Literal = string | number;

export type ValidationRule<Type = unknown> = (val: Type) =>
  ValidationRuleResult;

export type ValidationError = {
  message: string;
  value: unknown;
};

export type Success<Type> = {
  readonly success: true;
  readonly value: Type;
};

export type Failure = {
  readonly success: false;
  readonly errors: ValidationError[];
};

export type DecodeResult<Type = unknown> = Success<Type>
  | Failure;

/**
 * A decoder is an entity that can decode and encode object and JSON payloads.
 */
export interface IDecoder<Type> {
  readonly __TYPE__: Type;

  decode: (value: unknown) => DecodeResult<Type>;
}

/**
 * A decoder is an entity that can decode values.
 * This one can implement custom rules for the payload to be validated.
 */
export interface ICustomizableDecoder<Type> extends IDecoder<Type> {
  withRule: (rule: ValidationRule) => this;
}

export type TypeOf<
  TDecoder extends IDecoder<any> | ICustomizableDecoder<any>
> = TDecoder["__TYPE__"];
