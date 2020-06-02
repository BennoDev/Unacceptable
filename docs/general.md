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

### Create a custom decoder
