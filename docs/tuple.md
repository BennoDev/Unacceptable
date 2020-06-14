# Tuple

Validates the given value is a tuple with a defined amount of keys where the value at every index passes through the respective validator.
Infers to `[Type1, Type2, ...TypeN]` where `Type1, Type2, ...TypeN` are the inferred types of the respective validators.

This validator is strict, if there are more elements than specified validators, it will fail.

Example:

```ts
import { v } from "unacceptable";

const result = d
  .type([v.string(), v.string(), v.boolean()])
  .validate(["first", "second", false]);
// result is Success<[string, string, boolean]>
```
