import { assertEquals } from "../../test-deps.ts";
import { record } from "./record.ts";
import { number } from "./number.ts";
import { string } from "./string.ts";
import { array } from "./array.ts";

const cases = [
  {
    description: "Record<string, number>",
    decoder: record(number()),
    value: {
      property: 13,
      property2: 14
    }
  },
  {
    description: "Record<string, string>",
    decoder: record(string()),
    value: {
      property: "13",
      property2: "14"
    }
  },
  {
    description: "Record<string, Record<string, string>>",
    decoder: record(record(string())),
    value: {
      property: {
        nestedProperty: "Value"
      }
    }
  },
  {
    description:
      "Record<string, Record<string, Array<Record<string, number>>>>",
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
];

cases.forEach(({ decoder, value, description }) => {
  Deno.test({
    name:
      `RecordDecoder: should successfully decode a record type: ${description}`,
    fn: () => {
      const result = decoder.decode(value);
      assertEquals(result.success, true);
    }
  });
});
