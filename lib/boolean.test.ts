import { assertEquals } from "../test-deps.ts";
import { boolean } from "./boolean.ts";

Deno.test({
  name: "BooleanDecoder: should successfully decode boolean",
  fn: () => {
    const decoder = boolean();
    const result = decoder.decode(false);

    assertEquals(result.success, true);
  }
});

const nonBoolean = [
  {},
  [],
  "1",
  Symbol(),
  1,
  null,
  undefined
];

nonBoolean.forEach(toValidate => {
  Deno.test({
    name:
      `BooleanDecoder: should return false when not boolean: ${typeof toValidate}`,
    fn: () => {
      const decoder = boolean();
      const result = decoder.decode(toValidate);

      assertEquals(result.success, false);
    }
  });
});
