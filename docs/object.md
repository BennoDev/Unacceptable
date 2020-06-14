# Object

Valides the given value is a plain object (null or array will result in a failure). Infers to `object`

Example:

```ts
import { v } from "unacceptable";

const result = v.object().validate({ key1: "value", key2: 23, key3: [1, "2"] });
// result is Success<object>
```
