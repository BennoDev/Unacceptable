import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { boolean } from "./boolean.ts";

runSuccessTestCases([
  {
    decoder: boolean(),
    description: "boolean: should return success for true",
    value: true
  },
  {
    decoder: boolean(),
    description: "boolean: should return success for false",
    value: false
  }
]);

runFailureTestCases([
  {
    decoder: boolean(),
    description: "boolean: should return failure for: {}",
    value: {}
  },
  {
    decoder: boolean(),
    description: "boolean: should return failure for: []",
    value: []
  },
  {
    decoder: boolean(),
    description: "boolean: should return failure for: '1'",
    value: "1"
  },
  {
    decoder: boolean(),
    description: "boolean: should return failure for: Symbol()",
    value: Symbol()
  },
  {
    decoder: boolean(),
    description: "boolean: should return failure for: 1",
    value: 1
  },
  {
    decoder: boolean(),
    description: "boolean: should return failure for: null",
    value: null
  },
  {
    decoder: boolean(),
    description: "boolean: should return failure for: undefined",
    value: undefined
  }
]);
