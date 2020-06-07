# Array

Valides the given value is an array where each element successfully passes through the given decoder.
Infers to `Array<Type>` where Type is the inferred type of the argument decoder.

Example:

```ts
import { d } from "unacceptable";

const result = d
  .array(d.type({ firstName: d.string() }))
  .decode([{ firstName: "Ghenghis" }, { firstName: "Conan" }]);
// result is Success<Array<{ firstName: string }>>
```
