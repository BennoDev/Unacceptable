import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { undefinedDecoder } from "./undefined.ts";

runSuccessTestCases([
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return success for: undefined",
    value: undefined
  }
]);

runFailureTestCases([
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: {}",
    value: {}
  },
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: []",
    value: []
  },
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: '1'",
    value: "1"
  },
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: Symbol()",
    value: Symbol()
  },
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: false",
    value: false
  },
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: 1",
    value: 1
  },
  {
    decoder: undefinedDecoder(),
    description: "undefinedDecoder: should return failure for: null",
    value: null
  }
]);
