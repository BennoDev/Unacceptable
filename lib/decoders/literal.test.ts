import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { literal } from "./literal.ts";

runSuccessTestCases([
  {
    decoder: literal("localStorage"),
    description: "literal: should return success for: 'localStorage'",
    value: "localStorage"
  },
  {
    decoder: literal(202),
    description: "literal: should return success for: 202",
    value: 202
  }
]);

runFailureTestCases([
  {
    decoder: literal("localStorage"),
    description: "literal: should return failure for: 'localStorage'",
    value: "sessionStorage"
  },
  {
    decoder: literal(201),
    description: "literal: should return failure for: 201",
    value: 202
  },
  {
    decoder: literal(204),
    description: "literal: should return failure for: 204",
    value: "204"
  }
]);
