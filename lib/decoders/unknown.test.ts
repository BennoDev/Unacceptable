import { runSuccessTestCases } from "./test-helpers.ts";
import { unknown } from "./unknown.ts";

runSuccessTestCases([
  {
    decoder: unknown(),
    description: "unknown: should return success for: {}",
    value: {}
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: []",
    value: []
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: 1",
    value: 1
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: Symbol()",
    value: Symbol()
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: undefined",
    value: undefined
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: null",
    value: null
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: false",
    value: false
  },
  {
    decoder: unknown(),
    description: "unknown: should return success for: string",
    value: "hey"
  }
]);
