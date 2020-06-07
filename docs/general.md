# Unacceptable

Unacceptable is a Deno-first library for decoding and validating unknown data that takes advantage of Typescript's flexible type system, to allow static type generation from decoders.

Strongly influenced by existing libraries such as io-ts, runtypes and joi.

## Basic Usage

Decoders can be used as such:

```ts
import { d, Infer, isSuccess } from "unacceptable";

const ageDecoder = d.string().withRule({
  name: "IsAge",
  fn: (value) =>
    Number.isInteger(value) && value > 0 && value < 120
      ? null
      : "Given number is not a proper age",
});

const UserProfile = d.type({
  email: d.string(),
  firstName: d.string(),
  lastName: d.string(),
  age: ageDecoder,
});
type UserProfile = Infer<typeof UserProfile>;

const result = UserProfile.decode({
  email: "Ghenghis_Roundstone@something.com",
  firstName: "Ghenghis",
  lastName: "Roundstone",
  age: 100,
});

if (isSuccess(result)) {
  // Value is of type UserProfile
  console.log("Valid profile: ", result.value);
} else {
  console.error("Invalid data: ", result.errors);
}
```

For examples of specific decoders, check their respective documentation pages, or browse the tests.

## Documentation

Roughly speaking we can separate the decoders into 3 types:

- Primitive decoders (`string, number, boolean, literal, undefined, null`)
- Non-primitive decoders (`object, array, type, record`)
- And those that fall outside (`any, unknown, union, intersection`)

Each decoder has a dedicated page in the documentation with examples and deeper explanations.

### Decoders

### Validation rules

Certain decoders, namely `string`, `number`, `array` and `record`, can have custom validation rules, added on top of the base validation. Validation should not mutate or change the data that is being validated, but merely assert conditions.

The return type for a rule is `string | null` where string refers to the error message.

```ts
const decoder = string().withRule({
  name: "Password",
  fn: () => {
    const trimmedValue = value.trim();
    const isCorrectLength =
      trimmedValue.length >= 8 && trimmedValue.length < 255;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z]).{8,}$/;
    return isCorrectLength && passwordRegex.test(value);
  },
});

// Result is type Failure
const result = decoder.decode("notgoodenough");
```

### Create a custom decoder

Creating your own decoder is easy, just create a class that extends either `Decoder<T>` or `DecoderWithRules<T>` (if you want a decoder that can have additional rules).
You then need to implement the abstract method `decode(value: unknown) => DecodeResult<Type>` where Type is the return type/the type that will be inferred, and also
the type that is given to the DecoderWithRules generic class.

Example: simple decoder

```ts
import { success, failure, Decoder } from "unacceptable";

class DateDecoder implements Decoder<Date> {
  decode(value: unknown): DecodeResult<Date> {
    if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
      return success(new Date(value));
    }

    return failure([
      {
        name: "date",
        message: "The given value is not a valid iso string",
        value,
      },
    ]);
  }
}

const decoder = new DateDecoder();
const result = decoder.decode(new Date().toISOString());
// result is Success<Date>
```

Or as a decoder that can have custom rules:

```ts
class DateDecoder implements DecoderWithRules<Date> {
  decode(value: unknown): DecodeResult<Date> {
    const timestamp = Date.parse(value);
    if (typeof value !== "string" || Number.isNaN(timestamp)) {
      return failure([
        {
          name: "date",
          message: "The given value is not a valid iso string",
          value,
        },
      ]);
    }

    const errors = this.validateRules(new Date(timestamp));
    return errors.length > 0 ? failure(errors) : success(value);
  }
}

const date = new DateDecoder().withRule({
  name: "After2000",
  fn: (value: string) => {
    // We already know it's a valid date
    const date = new Date(value);
    return Date.getYear(date) > 2000
      ? null
      : "Given date is from before the year 2000";
  },
});
const result = decoder.decode(new Date().toISOString());
// result is Success<Date>
```

For more information you can look at the individual decoder's documentation pages. Or dive into the source code / tests for concrete examples.
