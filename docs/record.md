# Record

Valides the given value is an object where all the keys need to succesfully pass through argument validator.
Infers to `Record<string, Type>` where Type is the inferred type of the argument validator.

Example:

```ts
import { v } from "unacceptable";

const result = d
  .record(v.string())
  .validate({ key1: "value", key2: 23, key3: [1, "2"] });
// result is Failure because key3 is not a string
```
