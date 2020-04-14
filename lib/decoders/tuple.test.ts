import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { tuple } from "./tuple.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { boolean } from "./boolean.ts";
import { record } from "./record.ts";
import { union } from "./union.ts";
import { literal } from "./literal.ts";
import { array } from "./array.ts";

runSuccessTestCases([
  {
    decoder: tuple([string(), number(), boolean()]),
    description:
      "tuple: should return success for: [string, number, boolean] -> ['hey', 23, true]",
    value: ["hey", 23, true]
  },
  {
    decoder: tuple([string()]),
    description: "tuple: should return success for: [string] -> ['hey']",
    value: ["hey"]
  },
  {
    decoder: tuple([string(), tuple([string(), number()])]),
    description:
      "tuple: should return success for: [string, [string, number]] -> ['hey', ['hey', 34]]",
    value: ["hey", ["hey", 34]]
  },
  {
    decoder: tuple(
      [array(number()), record(string()), union([literal("hey"), literal(0)])]
    ),
    description:
      "tuple: should return success for: [number[], record<string>, 'hey' | 0] -> [[[1, 3], { message: 'hey' }, 0]]",
    value: [[1, 3], { message: "hey" }, 0]
  }
]);

runFailureTestCases([
  {
    decoder: tuple([string(), number(), boolean()]),
    description:
      "tuple: should return failure for: [string, number, boolean] -> ['hey', false, true]",
    value: ["hey", false, true]
  },
  {
    decoder: tuple([boolean()]),
    description: "tuple: should return failure for: [boolean] -> ['false']",
    value: ["false"]
  },
  {
    decoder: tuple(
      [array(number()), record(string()), union([literal("hey"), literal(0)])]
    ),
    description:
      "tuple: should return success for: [number[], record<string>, 'hey' | 0] -> [[1, 3], { message: 'hey' }, '0']",
    value: [[1, 3], { message: "hey" }, "0"]
  },
  {
    decoder: tuple([string(), tuple([string(), number()])]),
    description:
      "tuple: should return success for: [string, [string, number]] -> ['hey', ['hey', 34]]",
    value: [0, [0, 34]]
  }
]);
