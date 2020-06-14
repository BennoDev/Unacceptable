# Literal

Valides the given value is equal to the literal argument (has to be a string or a number).
Infers to the value of the literal type.

Example:

```ts
import { v } from "unacceptable";

const result = v.literal("200").validate("200");
// result is Success<"200">
```
