import { assertEquals } from "../../test-deps.ts";
import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { array } from "./array.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { record } from "./record.ts";
import { ValidationRule, Failure } from "../types.ts";

runSuccessTestCases([
  {
    description: "array: should return success for: Array<number>",
    validator: array(number()),
    value: [1, 2, 3],
  },
  {
    description: "array: should return success for: Array<string>",
    validator: array(string()),
    value: ["abc", "def", "ghi"],
  },
  {
    description:
      "array: should return success for: Array<Record<string, number>>",
    validator: array(record(number())),
    value: [
      {
        property: 1,
      },
      {
        property: 2,
      },
    ],
  },
]);

runFailureTestCases([
  {
    description: "array: should return failure for: Array<number>",
    validator: array(number()),
    value: ["1", "2", "3"],
  },
  {
    description: "array: should return failure for: Array<string>",
    validator: array(string()),
    value: [1, 2, 3],
  },
  {
    description:
      "array: should return failure for: Array<Record<string, number>>",
    validator: array(record(number())),
    value: [
      {
        property: "hey",
      },
      {
        property: "there",
      },
    ],
  },
]);

// Test cases with rules
const maxFiveItems: ValidationRule<number[]> = {
  name: "maxFiveItems",
  fn: (value) =>
    value.length > 5 ? "Array cant contain more than 5 elements" : null,
};

const notEmpty: ValidationRule<number[]> = {
  name: "notEmpty",
  fn: (value) => (value.length === 0 ? "Array cant be empty" : null),
};

const isPositive: ValidationRule<number> = {
  name: "isPositive",
  fn: (value) => (value <= 0 ? "Number has to be larger than 0" : null),
};

runSuccessTestCases([
  {
    description: "array: should return success with rule: maxFiveItems",
    validator: array(number()).withRule(maxFiveItems),
    value: [1, 2, 3],
  },
  {
    description: "array: should return success with rule: notEmpty",
    validator: array(number().withRule(isPositive)).withRule(notEmpty),
    value: [2, 4, 6, 8, 10],
  },
]);

runFailureTestCases([
  {
    description: "array: should return failure with rule: maxFiveItems",
    validator: array(number()).withRule(maxFiveItems),
    value: [1, 2, 3, 4, 5, 6],
  },
  {
    description: "array: should return failure with rule: notEmpty",
    validator: array(number().withRule(isPositive)).withRule(notEmpty),
    value: [2, 4, 6, 8, -10],
  },
]);

Deno.test({
  name: "array: should add error path information",
  fn: () => {
    const validator = array(string());
    const result = validator.validate(["first", 2, "third"]) as Failure;

    assertEquals(result.errors.length, 1);
    assertEquals(result.errors[0].path?.[0], "1");
  },
});
