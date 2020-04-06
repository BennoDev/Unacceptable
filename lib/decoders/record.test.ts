import { runSuccessTestCases } from "./test-helpers.ts";
import { record } from "./record.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { array } from "./array.ts";

runSuccessTestCases([
  {
    description: "record: should success for: Record<string, number>",
    decoder: record(number()),
    value: {
      property: 13,
      property2: 14
    }
  },
  {
    description: "record: should success for: Record<string, string>",
    decoder: record(string()),
    value: {
      property: "13",
      property2: "14"
    }
  },
  {
    description:
      "record: should success for: Record<string, Record<string, string>>",
    decoder: record(record(string())),
    value: {
      property: {
        nestedProperty: "Value"
      }
    }
  },
  {
    description:
      "record: should success for: Record<string, Record<string, Array<Record<string, number>>>>",
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
