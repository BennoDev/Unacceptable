# Null

Validates the given value is null. Infers to `null`

Example:

```ts
import { d } from "unacceptable";

const result = d.null().decode(null);
// result is Success<null>
```
