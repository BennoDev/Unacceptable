# Intersection

Validates the given value successfully passes through all the argument
validators. If any of the validators returns a failure, the entire operation
will abort and result in a failure. The inferred type is an intersection of each
of the validator's inferred static type.

Example:

```ts
import { v } from "unacceptable";

const result = v
  .intersection([
    v.type({ firstName: v.string(), lastName: v.string() }),
    v.type({ street: v.string(), city: v.string() }),
  ])
  .validate({
    firstName: "Djenghis",
    lastName: "Squarebrick",
    street: "Coolstreet 1",
    city: "BestTown",
  });
/**
 * result is Success<
 * {
 *    firstName: string;
 *    lastName: string;
 *    street: string;
 *    city: string;
 * }>
 */
```
