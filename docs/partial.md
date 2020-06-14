# Partial

Behaves similar to the `Type` validator, except that all values are also allowed to be `undefined`.
The type that is inferred here is very similar to that of a `Type` validator, with the addition that every value is also allowed to be `undefined`. This is _not_ a deep partial, it only affect direct children of the partial validator.

Example:

```ts
import { d, IValidator, Infer } from "unacceptable";

const nonEmptyString = v.string().withRule({
  name: "NonEmptyString",
  fn: (value: string) => (value === "" ? "Value can't be empty" : null),
});

const addresses = d
  .array(
    v.type({
      street: nonEmptyString,
      number: v.number().withRule({
        name: "Positive",
        fn: (value: number) =>
          number > 0 && Number.isInteger(value)
            ? null
            : "Number has to be a positive integer",
      }),
      zipCode: nonEmptyString,
    })
  )
  .withRule({
    name: "NonEmptyList",
    fn: (value: unknown[]) =>
      value.length === 0 ? "Need atleast one address" : null,
  });

const Request = v.partial({
  addresses,
  firstName: nonEmptyString,
  lastName: nonEmptyString,
  employment: v.type({
    title: nonEmptyString,
    companyName: nonEmptyString,
  }),
});

/**
 * Equal to:
 * {
 *      firstName: string | undefined;
 *      lastName: string | undefined;
 *      employment: {
 *          title: string;
 *          companyName: string;
 *      } | undefined;
 *      addresses: Array<{
 *          zipCode: string;
 *          street: string;
 *          number: string;
 *      }> | undefined
 * }
 */
type Request = Infer<typeof Request>;
```
