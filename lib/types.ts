export type Literal = string | number;

export type ValidationRule<Type = unknown> = (val: Type) => string | null;

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

export interface IDecoder<Type> {
  readonly __TYPE__: Type;

  decode: (value: unknown) => DecodeResult<Type>;
}

export type TypeOf<TDecoder extends IDecoder<any>> = TDecoder["__TYPE__"];
