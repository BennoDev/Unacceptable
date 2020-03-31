import { assertEquals } from "../test-deps.ts";
import { string } from "./string.ts";
import { ValidationRule, Failure } from "./types.ts";

Deno.test({
  name: "StringDecoder: should successfully validate string",
  fn: () => {
    const decoder = string();
    const result = decoder.decode("1");

    assertEquals(result.success, true);
  }
});

const nonStrings = [
  {},
  [],
  1,
  Symbol(),
  undefined,
  null,
  false
];

nonStrings.forEach(toValidate => {
  Deno.test({
    name:
      `StringDecoder: should return false when not a string: ${typeof toValidate}`,
    fn: () => {
      const decoder = string();
      const result = decoder.decode(toValidate);
      assertEquals(result.success, false);
    }
  });
});

const rules: Array<{
  value: string;
  name: string;
  rule: ValidationRule<string>;
  expected: boolean;
}> = [
  {
    value: "192.0.0.1",
    expected: true,
    name: "Ipv4Address",
    rule: (value) => {
      const ipAddressRegex =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
      return ipAddressRegex.test(value)
        ? null
        : "String is not an ipv4 address";
    }
  },
  {
    value: "1E:3DAA:5E:23:4C",
    expected: false,
    name: "MacAddress",
    rule: (value) => {
      const macAddressRegex =
        /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
      return macAddressRegex.test(value)
        ? null
        : "String is not a mac address";
    }
  },
  {
    value: "test@mail.com",
    expected: true,
    name: "Email",
    rule: (value) => {
      const emailRegex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      return emailRegex.test(value) ? null : "Number is not an integer";
    }
  }
];

rules.forEach(({ name, rule, value, expected }) => {
  Deno.test(
    {
      name: `NumberDecoder: should successfully validate with rule: ${name}`,
      fn: () => {
        const decoder = string().withRule(rule);
        const result = decoder.decode(value);
        assertEquals(result.success, expected);
      }
    }
  );
});

Deno.test({
  name: "StringDecoder: should allow multiple rules to be combined",
  fn: () => {
    const isNotEmpty: ValidationRule<string> = (value) =>
      value !== "" ? null : "Value can't be empty";
    const containsUnderscore: ValidationRule<string> = (value) =>
      value.includes("_") ? null : "Value needs atleast one underscore";

    const decoder = string()
      .withRule(isNotEmpty)
      .withRule(containsUnderscore);
    const result = decoder.decode("") as Failure;
    assertEquals(result.errors.length, 2);
  }
});
