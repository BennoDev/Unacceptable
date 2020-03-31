import { assertEquals } from "../test-deps.ts";
import { nullish } from "./nullish.ts";

Deno.test({
  name: "NullishDecoder: should successfully validate undefined",
  fn: () => {
    const decoder = nullish();
    const result = decoder.decode(undefined);

    assertEquals(result.success, true);
  }
});

Deno.test({
  name: "NullishDecoder: should successfully validate null",
  fn: () => {
    const decoder = nullish();
    const result = decoder.decode(null);

    assertEquals(result.success, true);
  }
});

const nonNullish = [
  {},
  [],
  "1",
  Symbol(),
  false,
  1
];

nonNullish.forEach(toValidate => {
  Deno.test({
    name:
      `NullishDecoder: should return false when not nullish: ${typeof toValidate}`,
    fn: () => {
      const decoder = nullish();
      const result = decoder.decode(toValidate);

      assertEquals(result.success, false);
    }
  });
});
