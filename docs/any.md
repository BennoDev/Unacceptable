# Any

One of the simplest decoders, `any` will always return a success result, with a value that infers to `any`.

Example:

```ts
import { d } from "unacceptable";

const result = d.any().decode({ key1: "value", key2: 23, key3: [1, "2"] });
// result is Success<any>
```
