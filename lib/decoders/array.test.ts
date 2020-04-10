import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { array } from "./array.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { record } from "./record.ts";
import { ValidationRule } from "../types.ts";

runSuccessTestCases([
  {
    description: "array: should return success for: Array<number>",
    decoder: array(number()),
    value: [1, 2, 3]
  },
  {
    description: "array: should return success for: Array<string>",
    decoder: array(string()),
    value: ["abc", "def", "ghi"]
  },
  {
    description:
      "array: should return success for: Array<Record<string, number>>",
    decoder: array(record(number())),
    value: [
      {
        property: 1
      },
      {
        property: 2
      }
    ]
  }
]);

runFailureTestCases([
  {
    description: "array: should return failure for: Array<number>",
    decoder: array(number()),
    value: ["1", "2", "3"]
  },
  {
    description: "array: should return failure for: Array<string>",
    decoder: array(string()),
    value: [1, 2, 3]
  },
  {
    description:
      "array: should return failure for: Array<Record<string, number>>",
    decoder: array(record(number())),
    value: [
      {
        property: "hey"
      },
      {
        property: "there"
      }
    ]
  }
]);

// Test cases with rules
const maxFiveItems: ValidationRule<number[]> = (value) =>
  value.length > 5 ? "Array cant contain more than 5 elements" : null;

const notEmpty: ValidationRule<number[]> = (value) =>
  value.length === 0 ? "Array cant be empty" : null;

const isPositive: ValidationRule<number> = (value) =>
  value <= 0 ? "Number has to be larger than 0" : null;

runSuccessTestCases([
  {
    description: "array: should return success with rule: maxFiveItems",
    decoder: array(number()).withRule(maxFiveItems),
    value: [
      1,
      2,
      3
    ]
  },
  {
    description: "array: should return success with rule: notEmpty",
    decoder: array(number().withRule(isPositive)).withRule(notEmpty),
    value: [2, 4, 6, 8, 10]
  }
]);

runFailureTestCases([
  {
    description: "array: should return failure with rule: maxFiveItems",
    decoder: array(number()).withRule(maxFiveItems),
    value: [
      1,
      2,
      3,
      4,
      5,
      6
    ]
  },
  {
    description: "array: should return failure with rule: notEmpty",
    decoder: array(number().withRule(isPositive)).withRule(notEmpty),
    value: [2, 4, 6, 8, -10]
  }
]);
