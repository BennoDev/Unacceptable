# Null

Validates the given value is null. Infers to `null`

Example:

```ts
import { v } from "unacceptable";

const result = v.null().validate(null);
// result is Success<null>
```
