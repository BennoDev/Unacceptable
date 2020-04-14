import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { union } from "./union.ts";
import { literal } from "./literal.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { array } from "./array.ts";
import { boolean } from "./boolean.ts";

runSuccessTestCases([
  {
    decoder: union([literal("12"), literal(2)]),
    description: "union: should return success for: '12' | 2 -> '12'",
    value: "12"
  },
  {
    decoder: union([literal(200), literal(201), literal(204)]),
    description: "union: should return success for: 200 | 201 | 204 -> 200",
    value: 200
  },
  {
    decoder: union([literal("OK"), literal("CREATED"), literal("NO_CONTENT")]),
    description:
      "union: should return success for: 'OK' | 'CREATED' | 'NO_CONTENT' -> 'CREATED'",
    value: "CREATED"
  },
  {
    decoder: union([array(string()), boolean()]),
    description:
      "union: should return success for: string[] | boolean -> string[]",
    value: ["hello", "there"]
  },
  {
    decoder: union([number(), boolean()]),
    description:
      "union: should return success for: number | boolean -> number",
    value: 1
  }
]);

runFailureTestCases([
  {
    decoder: union([literal("12"), literal(2)]),
    description: "union: should return failure for: '12' | 2 -> 12",
    value: 12
  },
  {
    decoder: union([literal(200), literal(201), literal(204)]),
    description: "union: should return failure for: 200 | 201 | 204 -> '200'",
    value: "200"
  },
  {
    decoder: union([literal("OK"), literal("CREATED"), literal("NO_CONTENT")]),
    description:
      "union: should return failure for: 'OK' | 'CREATED' | 'NO_CONTENT' -> 'CREATEDZ'",
    value: "CREATEDZ"
  },
  {
    decoder: union([string(), number()]),
    description:
      "union: should return failure for: string | number -> boolean",
    value: false
  },
  {
    decoder: union([array(string()), boolean()]),
    description:
      "union: should return failure for: string[] | boolean -> string",
    value: "hello"
  },
  {
    decoder: union([number(), boolean()]),
    description:
      "union: should return failure for: number | boolean -> number[]",
    value: [1, 2, 3]
  }
]);
