import { runSuccessTestCases } from "./test-helpers.ts";
import { unknown } from "./unknown.ts";

runSuccessTestCases([
  {
    validator: unknown(),
    description: "unknown: should return success for: {}",
    value: {},
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: []",
    value: [],
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: 1",
    value: 1,
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: Symbol()",
    value: Symbol(),
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: undefined",
    value: undefined,
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: null",
    value: null,
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: false",
    value: false,
  },
  {
    validator: unknown(),
    description: "unknown: should return success for: string",
    value: "hey",
  },
]);
