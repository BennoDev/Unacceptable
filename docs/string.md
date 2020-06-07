# String

Valides the given value to be a string. Can have custom validation rules.
Infers to `string`.

Example:

```ts
import { d } from "unacceptable";

const result = d
  .string()
  .withRule({
    name: "notEmpty",
    fn: (value: string) => (value !== "" ? null : "Given value is empty"),
  })
  .decode("a value");
// result is Success<string>
```
