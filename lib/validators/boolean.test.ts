import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { boolean } from "./boolean.ts";

runSuccessTestCases([
  {
    validator: boolean(),
    description: "boolean: should return success for: true",
    value: true,
  },
  {
    validator: boolean(),
    description: "boolean: should return success for: false",
    value: false,
  },
]);

runFailureTestCases([
  {
    validator: boolean(),
    description: "boolean: should return failure for: {}",
    value: {},
  },
  {
    validator: boolean(),
    description: "boolean: should return failure for: []",
    value: [],
  },
  {
    validator: boolean(),
    description: "boolean: should return failure for: '1'",
    value: "1",
  },
  {
    validator: boolean(),
    description: "boolean: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    validator: boolean(),
    description: "boolean: should return failure for: 1",
    value: 1,
  },
  {
    validator: boolean(),
    description: "boolean: should return failure for: null",
    value: null,
  },
  {
    validator: boolean(),
    description: "boolean: should return failure for: undefined",
    value: undefined,
  },
]);
