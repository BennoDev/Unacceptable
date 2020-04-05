import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { nullDecoder } from "./null.ts";

runSuccessTestCases([
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return success for: null",
    value: null
  }
]);

runFailureTestCases([
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: {}",
    value: {}
  },
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: []",
    value: []
  },
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: '1'",
    value: "1"
  },
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: Symbol()",
    value: Symbol()
  },
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: false",
    value: false
  },
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: 1",
    value: 1
  },
  {
    decoder: nullDecoder(),
    description: "nullDecoder: should return failure for: undefined",
    value: undefined
  }
]);
