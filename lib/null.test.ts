import { assertEquals } from "../test-deps.ts";
import { nullDecoder } from "./null.ts";

Deno.test({
  name: "NullDecoder: should successfully validate null",
  fn: () => {
    const decoder = nullDecoder();
    const result = decoder.decode(null);

    assertEquals(result.success, true);
  }
});

const nonNull = [
  {},
  [],
  "1",
  Symbol(),
  false,
  1,
  undefined
];

nonNull.forEach(toValidate => {
  Deno.test({
    name:
      `NullDecoder: should return false when not null: ${typeof toValidate}`,
    fn: () => {
      const decoder = nullDecoder();
      const result = decoder.decode(toValidate);

      assertEquals(result.success, false);
    }
  });
});
