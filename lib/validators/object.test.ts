import { runFailureTestCases, runSuccessTestCases } from "./test-helpers.ts";
import { object } from "./object.ts";

runSuccessTestCases([
  {
    validator: object(),
    description: "object: should return success for: {}",
    value: {
      message: "Something here",
    },
  },
  {
    validator: object(),
    description: "object: should return success for: Record<string, number[]>",
    value: {
      property: [1, 2, 3, 4],
      anotherProperty: [5, 6, 7, 8],
    },
  },
]);

runFailureTestCases([
  {
    validator: object(),
    description: "object: should return failure for: '1'",
    value: "1",
  },
  {
    validator: object(),
    description: "object: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    validator: object(),
    description: "object: should return failure for: 1",
    value: 1,
  },
  {
    validator: object(),
    description: "object: should return failure for: null",
    value: null,
  },
  {
    validator: object(),
    description: "object: should return failure for: undefined",
    value: undefined,
  },
  {
    validator: object(),
    description: "object: should return failure for: []",
    value: [],
  },
]);
