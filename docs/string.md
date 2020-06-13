# String

Valides the given value to be a string. Can have custom validation rules.
Infers to `string`.

Example:

```ts
import { v } from "unacceptable";

const result = d
  .string()
  .withRule({
    name: "notEmpty",
    fn: (value: string) => (value !== "" ? null : "Given value is empty"),
  })
  .validate("a value");
// result is Success<string>
```
