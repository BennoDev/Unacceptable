import { runSuccessTestCases } from "./test-helpers.ts";
import { any } from "./any.ts";

runSuccessTestCases([
  {
    validator: any(),
    description: "any: should return success for: {}",
    value: {},
  },
  {
    validator: any(),
    description: "any: should return success for: []",
    value: [],
  },
  {
    validator: any(),
    description: "any: should return success for: 1",
    value: 1,
  },
  {
    validator: any(),
    description: "any: should return success for: Symbol()",
    value: Symbol(),
  },
  {
    validator: any(),
    description: "any: should return success for: undefined",
    value: undefined,
  },
  {
    validator: any(),
    description: "any: should return success for: null",
    value: null,
  },
  {
    validator: any(),
    description: "any: should return success for: false",
    value: false,
  },
  {
    validator: any(),
    description: "any: should return success for: string",
    value: "hey",
  },
]);
