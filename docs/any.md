# Any

One of the simplest validators, `any` will always return a success result, with a value that infers to `any`.

Example:

```ts
import { v } from "unacceptable";

const result = v.any().validate({ key1: "value", key2: 23, key3: [1, "2"] });
// result is Success<any>
```
