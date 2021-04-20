import { runFailureTestCases, runSuccessTestCases } from "./test-helpers.ts";
import { number } from "./number.ts";
import { ValidationRule } from "../types.ts";

runSuccessTestCases([
  {
    validator: number(),
    description: "number: should return success for: 1",
    value: 1,
  },
  {
    validator: number(),
    description: "number: should return success for: 15665796",
    value: 15665796,
  },
]);

runFailureTestCases([
  {
    validator: number(),
    description: "number: should return success for: {}",
    value: {},
  },
  {
    validator: number(),
    description: "number: should return success for: []",
    value: [],
  },
  {
    validator: number(),
    description: "number: should return success for: '1'",
    value: "1",
  },
  {
    validator: number(),
    description: "number: should return success for: Symbol()",
    value: Symbol(),
  },
  {
    validator: number(),
    description: "number: should return success for: undefined",
    value: undefined,
  },
  {
    validator: number(),
    description: "number: should return success for: null",
    value: null,
  },
  {
    validator: number(),
    description: "number: should return success for: false",
    value: false,
  },
]);

// Test cases with rules
const between0And10: ValidationRule<number> = {
  name: "between0And10",
  fn: (value) =>
    value >= 0 && value <= 10 ? null : "Number is not in between 0 and 10",
};

const isPositive: ValidationRule<number> = {
  name: "isPositive",
  fn: (value) => (value >= 0 ? null : "Number is not positive"),
};

const isInteger: ValidationRule<number> = {
  name: "isInteger",
  fn: (value) => (Number.isInteger(value) ? null : "Number is not an integer"),
};

const biggerThanZero: ValidationRule<number> = {
  name: "biggerThanZero",
  fn: (value) => (value > 0 ? null : "Number is not bigger than 0"),
};

const smallerThanHundred: ValidationRule<number> = {
  name: "smallerThanHundred",
  fn: (value) => (value < 100 ? null : "Number is not smaller than 100"),
};

runSuccessTestCases([
  {
    validator: number().withRule(isPositive),
    description: "number: should return success with rule: isPositive",
    value: 8,
  },
  {
    validator: number().withRule(isPositive),
    description: "number: should return success with rule: isPositive",
    value: 8,
  },
]);

runFailureTestCases([
  {
    validator: number().withRule(smallerThanHundred),
    description: "number: should return failure with rule: smallerThanHundred",
    value: 5400.89,
  },
]);

runFailureTestCases([
  {
    validator: number().withRule(biggerThanZero).withRule(isInteger),
    description:
      "number: should return failure with rule: biggerThanZero + isInteger",
    value: -120.34,
  },
]);
