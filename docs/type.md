# Type

Validates the given object's shape where the specified keys have to pass their
respective validators. Every key that is present in the validated value and did
not pass through a validator _will be stripped_. Error messages from this
validator will have context information (the key) added. It will infer to an
object where the keys have the inferred type of their respective validators.

Example:

```ts
import { Infer, IValidator, v } from "unacceptable";

const nonEmptyString = v.string().withRule({
  name: "NonEmptyString",
  fn: (value: string) => (value === "" ? "Value can't be empty" : null),
});

const addresses = v
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
    }),
  )
  .withRule({
    name: "NonEmptyList",
    fn: (value: unknown[]) =>
      value.length === 0 ? "Need atleast one address" : null,
  });

const Request = v.type({
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
 *      firstName: string;
 *      lastName: string;
 *      employment: {
 *          title: string;
 *          companyName: string;
 *      };
 *      addresses: Array<{
 *          zipCode: string;
 *          street: string;
 *          number: string;
 *      }>
 * }
 */
type Request = Infer<typeof Request>;
```
