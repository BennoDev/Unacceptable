# Boolean

Validates the given value is a boolean. Infers to `boolean`

Example:

```ts
import { v } from "unacceptable";

const result = v.boolean().validate(true);
// result is Success<boolean>
```
