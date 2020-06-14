# Undefined

Validates the given value is undefined. Infers to `undefined`

Example:

```ts
import { v } from "unacceptable";

const result = v.undefined().validate(undefined);
// result is Success<undefined>
```
