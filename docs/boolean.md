# Boolean

Validates the given value is a boolean. Infers to `boolean`

Example:

```ts
import { d } from "unacceptable";

const result = d.boolean().decode(true);
// result is Success<boolean>
```