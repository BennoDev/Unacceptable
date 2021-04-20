import { runFailureTestCases, runSuccessTestCases } from "./test-helpers.ts";
import { literal } from "./literal.ts";

runSuccessTestCases([
  {
    validator: literal("localStorage"),
    description: "literal: should return success for: 'localStorage'",
    value: "localStorage",
  },
  {
    validator: literal(202),
    description: "literal: should return success for: 202",
    value: 202,
  },
]);

runFailureTestCases([
  {
    validator: literal("localStorage"),
    description: "literal: should return failure for: 'localStorage'",
    value: "sessionStorage",
  },
  {
    validator: literal(201),
    description: "literal: should return failure for: 201",
    value: 202,
  },
  {
    validator: literal(204),
    description: "literal: should return failure for: 204",
    value: "204",
  },
]);
