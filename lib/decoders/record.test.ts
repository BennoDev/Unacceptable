import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { record } from "./record.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { array } from "./array.ts";
import { ValidationRule } from "../types.ts";

runSuccessTestCases([
  {
    description: "record: should return success for: Record<string, number>",
    decoder: record(number()),
    value: {
      property: 13,
      property2: 14
    }
  },
  {
    description: "record: should return success for: Record<string, string>",
    decoder: record(string()),
    value: {
      property: "13",
      property2: "14"
    }
  },
  {
    description:
      "record: should return success for: Record<string, Record<string, string>>",
    decoder: record(record(string())),
    value: {
      property: {
        nestedProperty: "Value"
      }
    }
  },
  {
    description:
      "record: should return success for: Record<string, Record<string, Array<Record<string, number>>>>",
    decoder: record(record(array(record(number())))),
    value: {
      property: {
        nestedProperty: [
          { arrayProperty: 0 },
          { arrayProperty: 1 },
          { arrayProperty: 2 }
        ]
      }
    }
  }
]);

runFailureTestCases([
  {
    description:
      "record: should return failure for: Record<string, Record<string, Array<Record<string, number>>>>",
    decoder: record(record(array(record(number())))),
    value: {
      property: {
        nestedProperty: [
          { arrayProperty: "1" },
          { arrayProperty: "2" },
          { arrayProperty: "3" }
        ]
      }
    }
  },
  {
    description: "record: should return failure for: Record<string, number>",
    decoder: record(string()),
    value: {
      property: 12345.789
    }
  }
]);

// Test cases with rules
const doesntContainMessageKey: ValidationRule<Record<string, string>> = (
  value
) => {
  return value.hasOwnProperty("message")
    ? "Dont use message property, it conflicts with internal implementation"
    : null;
};

runSuccessTestCases([
  {
    decoder: record(string()).withRule(doesntContainMessageKey),
    value: {
      otherProperty: "bye"
    },
    description:
      "record: should return success with rule: doesntContainMessageKey"
  }
]);
