# Unknown

One of the simplest decoders, `unknown` will always return a success result, with a value that infers to `unknown`.

Example:

```ts
import { d } from "unacceptable";

const result = d.unknown().decode({ key1: "value", key2: 23, key3: [1, "2"] });
// result is Success<unknown>
```
