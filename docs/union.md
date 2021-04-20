# Union

Validates the given value successfully passes through one of the argument
validators. After the value successfully passes through a validator for the
first time it will instantly return, so if it were to successfully validate
through more than one validator, only the result of the first one in the list
will be returned.

This validator is often used in combination with `literal` to validate and
construct type literals. The inferred type is a union of all of the validator's
static type.

Example:

```ts
import { v } from "unacceptable";

const result = v
  .union([v.literal("200"), v.literal("201"), v.literal("204")])
  .validate("200");
// result is Success<"200" | "201" | "204">
```

However it can also work for complex types:

```ts
import { v } from "unacceptable";

const Video = v.validate({
  type: v.literal("VIDEO"),
  name: v.string(),
  length: v.number(),
  categories: v.array(v.string()),
});

const Image = v.validate({
  type: "IMAGE",
  name: v.string(),
  fileType: v.union([v.literal("png"), v.literal("jpg"), v.literal("gif")]),
  alt: v.string(),
});

const result = v.union([Image, Video]).validate({
  type: "VIDEO",
  name: "Half-Life 3 trailer",
  length: 90,
  categories: ["gaming", "entertainment", "dystopian", "sci-fi"],
});
/*
 * Result is Success<Infer<typeof Video> | Infer<typeof Image>>
 * By using a `type` field in both our decoders, we have created a discriminated union,
 * this means we the correct type can be inferred based on the value of `type`.
 *
 * if (result.value.type === "IMAGE") {
 *    const { fileType } = result.value; // will be defined
 * } else {
 *    const { fileType } = result.value; // will cause Typescript error
 * }
 */
```
