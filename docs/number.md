# Number

Valides the given value to be a number. Can have custom validation rules.
Infers to `number`.

Example:

```ts
import { d } from "unacceptable";

const result = d
  .number()
  .withRule({
    name: "integer",
    fn: (value: number) =>
      Number.isInteger(value) ? null : "Given value is not an integer",
  })
  .decode(9);
// result is Success<number>
```