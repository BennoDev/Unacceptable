import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { object } from "./object.ts";

runSuccessTestCases([
  {
    decoder: object(),
    description: "object: should return success for: {}",
    value: {
      message: "Something here"
    }
  },
  {
    decoder: object(),
    description: "object: should return success for: Record<string, number[]>",
    value: {
      property: [
        1,
        2,
        3,
        4
      ],
      anotherProperty: [
        5,
        6,
        7,
        8
      ]
    }
  }
]);

runFailureTestCases([
  {
    decoder: object(),
    description: "object: should return failure for: '1'",
    value: "1"
  },
  {
    decoder: object(),
    description: "object: should return failure for: Symbol()",
    value: Symbol()
  },
  {
    decoder: object(),
    description: "object: should return failure for: 1",
    value: 1
  },
  {
    decoder: object(),
    description: "object: should return failure for: null",
    value: null
  },
  {
    decoder: object(),
    description: "object: should return failure for: undefined",
    value: undefined
  },
  {
    decoder: object(),
    description: "object: should return failure for: []",
    value: []
  }
]);
