# Union

Validates the given successfully passes through one of the argument validators.
After the value successfully passes through a validator for the first time it will instantly return,
so if it were to successfully validate through more than one validator, only the result of the first one in the list will be returned.

This validator is often used in combination with `literal` to validate and construct type literals.

Example:

```ts
import { v } from "unacceptable";

const result = d
  .union([d.literal("200"), d.literal("201"), d.literal("204")])
  .decode("200");
// result is Success<"200" | "201" | "204">
```

However it can also work for complex types:

```ts
import { v } from "unacceptable";

const Video = d.decode({
  type: d.literal("VIDEO"),
  name: d.string(),
  length: d.number(),
  categories: d.array(d.string()),
});

const Image = d.decode({
  type: "IMAGE",
  name: d.string(),
  fileType: d.union([d.literal("png"), d.literal("jpg"), d.literal("gif")]),
  alt: d.string(),
});

const result = d.union([Image, Video]).decode({
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
