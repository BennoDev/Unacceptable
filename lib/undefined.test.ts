import { assertEquals } from "../test-deps.ts";
import { undefinedDecoder } from "./undefined.ts";

Deno.test({
  name: "UndefinedDecoder: should successfully validate undefined",
  fn: () => {
    const decoder = undefinedDecoder();
    const result = decoder.decode(undefined);

    assertEquals(result.success, true);
  }
});

const nonUndefined = [
  {},
  [],
  "1",
  Symbol(),
  false,
  1,
  null
];

nonUndefined.forEach(toValidate => {
  Deno.test({
    name:
      `UndefinedDecoder: should return false when not undefined: ${typeof toValidate}`,
    fn: () => {
      const decoder = undefinedDecoder();
      const result = decoder.decode(toValidate);

      assertEquals(result.success, false);
    }
  });
});
