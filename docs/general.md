# MUHVAL

Strongly typed data validation and decoding library for Deno.

## Usage

## Documentation

Decoders can be used as such:

```ts
import { d, Infer, isSuccess } from "somewhere";

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

### Decoders

### Validation rules

Certain decoders, namely `string`, `number`, `array` and `record`, can have custom validation rules, added on top of the base validation.

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

Creating your own decoder is easy, just create a class that extends either `Decoder` or `DecoderWithRules` (if you want a decoder that can have additional rules).

Example:

```ts
class DateDecoder implements DecoderWithRules<> {}
```
