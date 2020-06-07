# Undefined

Validates the given value is undefined. Infers to `undefined`

Example:

```ts
import { d } from "unacceptable";

const result = d.undefined().decode(undefined);
// result is Success<undefined>
```
