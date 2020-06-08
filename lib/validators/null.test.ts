import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { nullValidator } from "./null.ts";

runSuccessTestCases([
  {
    validator: nullValidator(),
    description: "nullValidator: should return success for: null",
    value: null,
  },
]);

runFailureTestCases([
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: {}",
    value: {},
  },
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: []",
    value: [],
  },
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: '1'",
    value: "1",
  },
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: false",
    value: false,
  },
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: 1",
    value: 1,
  },
  {
    validator: nullValidator(),
    description: "nullValidator: should return failure for: undefined",
    value: undefined,
  },
]);
