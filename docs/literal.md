# Literal

Valides the given value is equal to the literal argument (has to be a string or a number).
Infers to the value of the literal type.

Example:

```ts
import { d } from "unacceptable";

const result = d.literal("200").decode("200");
// result is Success<"200">
```