export type Literal = string | number;

export type ValidationRule<Type = unknown> = {
  name: string;
  fn: (val: Type) => string | null;
};

export type ValidationError = {
  /**
   * Value that failed decoding.
   */
  value: unknown;

  /**
   * Error message for failed rules.
   */
  message: string;

  /**
   * Name of the rule that failed.
   */
  name?: string;

  /**
   * Full path of the key relative to the root that is being decoded.
   */
  path?: string[];
};

export type Success<Type> = {
  readonly success: true;
  readonly value: Type;
};

export type Failure = {
  readonly success: false;
  readonly errors: ValidationError[];
};

export type DecodeResult<Type = unknown> = Success<Type> | Failure;

export interface IDecoder<Type> {
  readonly __TYPE__: Type;

  decode: (value: unknown) => DecodeResult<Type>;
}

export type TypeOf<Decoder extends IDecoder<any>> = Decoder["__TYPE__"];
