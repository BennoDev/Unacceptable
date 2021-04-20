import { runFailureTestCases, runSuccessTestCases } from "./test-helpers.ts";
import { undefinedValidator } from "./undefined.ts";

runSuccessTestCases([
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return success for: undefined",
    value: undefined,
  },
]);

runFailureTestCases([
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: {}",
    value: {},
  },
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: []",
    value: [],
  },
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: '1'",
    value: "1",
  },
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: false",
    value: false,
  },
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: 1",
    value: 1,
  },
  {
    validator: undefinedValidator(),
    description: "undefinedValidator: should return failure for: null",
    value: null,
  },
]);
