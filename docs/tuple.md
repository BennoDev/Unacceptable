# Tuple

Decodes the given value is a tuple with a efined amount of keys where the value at every index passes through the respective decoder.
Infers to `[Type1, Type2, ...TypeN]` where `Type1, Type2, ...TypeN` are the inferred types of the respective decoders.

This decoder is strict, if there are more elements than specified decoders, it will fail.

Example:

```ts
import { d } from "unacceptable";

const result = d
  .type([d.string(), d.string(), d.boolean()])
  .decode(["first", "second", false]);
// result is Success<[string, string, boolean]>
```
