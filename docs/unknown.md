# Unknown

One of the simplest validators, `unknown` will always return a success result,
with a value that infers to `unknown`.

Example:

```ts
import { v } from "unacceptable";

const result = v
  .unknown()
  .validate({ key1: "value", key2: 23, key3: [1, "2"] });
// result is Success<unknown>
```
