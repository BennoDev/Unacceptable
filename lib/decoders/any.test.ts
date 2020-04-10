import { runSuccessTestCases } from "./test-helpers.ts";
import { any } from "./any.ts";

runSuccessTestCases([
  {
    decoder: any(),
    description: "any: should return success for: {}",
    value: {}
  },
  {
    decoder: any(),
    description: "any: should return success for: []",
    value: []
  },
  {
    decoder: any(),
    description: "any: should return success for: 1",
    value: 1
  },
  {
    decoder: any(),
    description: "any: should return success for: Symbol()",
    value: Symbol()
  },
  {
    decoder: any(),
    description: "any: should return success for: undefined",
    value: undefined
  },
  {
    decoder: any(),
    description: "any: should return success for: null",
    value: null
  },
  {
    decoder: any(),
    description: "any: should return success for: false",
    value: false
  },
  {
    decoder: any(),
    description: "any: should return success for: string",
    value: "hey"
  }
]);
