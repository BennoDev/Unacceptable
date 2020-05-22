import { assertEquals } from "../../test-deps.ts";
import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { record } from "./record.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { array } from "./array.ts";
import { ValidationRule, Failure } from "../types.ts";

runSuccessTestCases([
  {
    description: "record: should return success for: Record<string, number>",
    decoder: record(number()),
    value: {
      property: 13,
      property2: 14,
    },
  },
  {
    description: "record: should return success for: Record<string, string>",
    decoder: record(string()),
    value: {
      property: "13",
      property2: "14",
    },
  },
  {
    description:
      "record: should return success for: Record<string, Record<string, string>>",
    decoder: record(record(string())),
    value: {
      property: {
        nestedProperty: "Value",
      },
    },
  },
  {
    description:
      "record: should return success for: Record<string, Record<string, Array<Record<string, number>>>>",
    decoder: record(record(array(record(number())))),
    value: {
      property: {
        nestedProperty: [
          { arrayProperty: 0 },
          { arrayProperty: 1 },
          { arrayProperty: 2 },
        ],
      },
    },
  },
]);

runFailureTestCases([
  {
    description:
      "record: should return failure for: Record<string, Record<string, Array<Record<string, number>>>>",
    decoder: record(record(array(record(number())))),
    value: {
      property: {
        nestedProperty: [
          { arrayProperty: "1" },
          { arrayProperty: "2" },
          { arrayProperty: "3" },
        ],
      },
    },
  },
  {
    description: "record: should return failure for: Record<string, number>",
    decoder: record(string()),
    value: {
      property: 12345.789,
    },
  },
]);

// Test cases with rules
const doesntContainMessageKey: ValidationRule<Record<string, string>> = {
  name: "doesntContainMessageKey",
  fn: (value) =>
    value.hasOwnProperty("message")
      ? "Dont use message property, it conflicts with internal implementation"
      : null,
};

const containsUnderscore: ValidationRule<string> = {
  name: "containsUnderscore",
  fn: (value) =>
    value.includes("_") ? null : "String has to contain an underscore",
};

runSuccessTestCases([
  {
    decoder: record(string()).withRule(doesntContainMessageKey),
    value: {
      otherProperty: "bye",
    },
    description:
      "record: should return success with rule: doesntContainMessageKey",
  },
  {
    decoder: record(string().withRule(containsUnderscore)).withRule(
      doesntContainMessageKey
    ),
    value: {
      otherProperty: "bye_bud",
    },
    description:
      "record: should return success with rule: containsUnderscore + doesntContainMessageKey",
  },
]);

runFailureTestCases([
  {
    decoder: record(string()).withRule(doesntContainMessageKey),
    value: {
      message: "Please don't",
    },
    description:
      "record: should return failure with rule: doesntContainMessageKey",
  },
  {
    decoder: record(string().withRule(containsUnderscore)),
    value: {
      message: "needs an underscore",
    },
    description: "record: should return failure with rule: containsUnderscore",
  },
]);

Deno.test({
  name: "record: should add error path information",
  fn: () => {
    const decoder = record(string());

    const result = decoder.decode({
      prop: 1,
    }) as Failure;

    assertEquals(result.errors.length, 1);
    assertEquals(result.errors[0].path, ["prop"]);
  },
});
