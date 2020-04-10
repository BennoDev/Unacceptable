import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { number } from "./number.ts";
import { ValidationRule } from "../types.ts";

runSuccessTestCases([
  {
    decoder: number(),
    description: "number: should return success for: 1",
    value: 1
  },
  {
    decoder: number(),
    description: "number: should return success for: 15665796",
    value: 15665796
  }
]);

runFailureTestCases([
  {
    decoder: number(),
    description: "number: should return success for: {}",
    value: {}
  },
  {
    decoder: number(),
    description: "number: should return success for: []",
    value: []
  },
  {
    decoder: number(),
    description: "number: should return success for: '1'",
    value: "1"
  },
  {
    decoder: number(),
    description: "number: should return success for: Symbol()",
    value: Symbol()
  },
  {
    decoder: number(),
    description: "number: should return success for: undefined",
    value: undefined
  },
  {
    decoder: number(),
    description: "number: should return success for: null",
    value: null
  },
  {
    decoder: number(),
    description: "number: should return success for: false",
    value: false
  }
]);

// Test cases with rules
const between0And10: ValidationRule<number> = (value) =>
  value >= 0 && value <= 10 ? null : "Number is not in between 0 and 10";

const isPositive: ValidationRule<number> = (value) =>
  value >= 0 ? null : "Number is not positive";

const isInteger: ValidationRule<number> = (value) =>
  Number.isInteger(value) ? null : "Number is not an integer";

const biggerThanZero: ValidationRule<number> = (value) =>
  value > 0 ? null : "Number is not bigger than 0";

const smallerThanHundred: ValidationRule<number> = (value) =>
  value < 100 ? null : "Number is not smaller than 100";

runSuccessTestCases([
  {
    decoder: number().withRule(isPositive),
    description: "number: should return success with rule: isPositive",
    value: 8
  },
  {
    decoder: number().withRule(isPositive),
    description: "number: should return success with rule: isPositive",
    value: 8
  }
]);

runFailureTestCases([
  {
    decoder: number().withRule(smallerThanHundred),
    description: "number: should return failure with rule: smallerThanHundred",
    value: 5400.89
  }
]);

runFailureTestCases([
  {
    decoder: number().withRule(biggerThanZero).withRule(isInteger),
    description:
      "number: should return failure with rule: biggerThanZero + isInteger",
    value: -120.34
  }
]);