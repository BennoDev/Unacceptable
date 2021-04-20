# Array

Valides the given value is an array where each element successfully passes
through the given validator. Infers to `Array<Type>` where Type is the inferred
type of the argument validator.

Example:

```ts
import { v } from "unacceptable";

const result = d
  .array(v.type({ firstName: v.string() }))
  .validate([{ firstName: "Ghenghis" }, { firstName: "Conan" }]);
// result is Success<Array<{ firstName: string }>>
```
