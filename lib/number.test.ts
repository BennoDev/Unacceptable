import { assertEquals } from "../test-deps.ts";
import { number } from "./number.ts";
import { ValidationRule, Failure } from "./types.ts";

Deno.test({
  name: "NumberDecoder: should successfully validate number",
  fn: () => {
    const decoder = number();
    const result = decoder.decode(1);

    assertEquals(result.success, true);
  }
});

const nonNumbers = [
  {},
  [],
  "1",
  Symbol(),
  undefined,
  null,
  false
];

nonNumbers.forEach(toValidate => {
  Deno.test({
    name:
      `NumberDecoder: should return false when not a number: ${typeof toValidate}`,
    fn: () => {
      const decoder = number();
      const result = decoder.decode(toValidate);
      assertEquals(result.success, false);
    }
  });
});

const rules: Array<{
  value: number;
  name: string;
  rule: ValidationRule<number>;
  expected: boolean;
}> = [
  {
    value: 8,
    expected: true,
    name: "Between",
    rule: (value) =>
      value >= 0 && value <= 10 ? null : "Number is not in between 0 and 10"
  },
  {
    value: -8,
    expected: false,
    name: "Positive",
    rule: (value) => value >= 0 ? null : "Number is not positive"
  },
  {
    value: 8.52,
    expected: false,
    name: "Integer",
    rule: (value) =>
      Number.isInteger(value) ? null : "Number is not an integer"
  }
];

rules.forEach(({ name, rule, value, expected }) => {
  Deno.test(
    {
      name: `NumberDecoder: should successfully validate with rule: ${name}`,
      fn: () => {
        const decoder = number().withRule(rule);
        const result = decoder.decode(value);
        assertEquals(result.success, expected);
      }
    }
  );
});

Deno.test({
  name: "NumberDecoder: should allow multiple rules to be combined",
  fn: () => {
    const biggerThanZero: ValidationRule<number> = (value) =>
      value > 0 ? null : "Value is smaller than 0";
    const isInteger: ValidationRule<number> = (value) =>
      Number.isInteger(value) ? null : "Value is higher than 100";

    const decoder = number()
      .withRule(biggerThanZero)
      .withRule(isInteger);
    const result = decoder.decode(-120.28) as Failure;
    assertEquals(result.errors.length, 2);
  }
});
