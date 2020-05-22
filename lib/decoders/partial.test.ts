import { assertEquals } from "../../test-deps.ts";
import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { Success } from "../types.ts";
import { partial } from "./partial.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { array } from "./array.ts";
import { type } from "./type.ts";

runSuccessTestCases([
  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "partial: should return success for { firstName: string, lastName: string, age: number }",
    value: { firstName: "Ronald", lastName: "McDonald" },
  },
  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      age: number(),
      address: partial({
        street: string(),
        city: string(),
      }),
    }),
    description:
      "partial: should return success for { firstName: string, lastName: string, age: number, address: { street: string, city: string } }",
    value: {
      firstName: "Ronald",
      lastName: "McDonald",
      address: { street: "High street" },
    },
  },
  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      addresses: array(
        partial({
          street: string(),
          city: string(),
        })
      ),
    }),
    description:
      "partial: should return success for { age: number, firstName: string, lastName: string, addresses: [ { street: string, city: string } ] }",
    value: {
      firstName: "Colonel",
      lastName: "Sanders",
      age: 99,
      addresses: [{ city: "Someplace" }, { street: "Lowstreet Five" }],
    },
  },
]);

runFailureTestCases([
  {
    decoder: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: []",
    value: [],
  },
  {
    decoder: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: '1'",
    value: "1",
  },
  {
    decoder: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    decoder: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: 1",
    value: 1,
  },
  {
    decoder: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: null",
    value: null,
  },
  {
    decoder: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: undefined",
    value: undefined,
  },

  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "partial: should return failure for { firstName: string, lastName: string, age: number }",
    value: { firstName: "Ronald", lastName: "McDonald", age: "23" },
  },
  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      age: number(),
      address: partial({
        street: string(),
        city: string(),
      }),
    }),
    description:
      "partial: should return failure for { firstName: string, lastName: string, age: number, address: { street: string, city: string } }",
    value: {
      firstName: "Ronald",
      lastName: "McDonald",
      address: { street: "High street", city: 2000 },
    },
  },
  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      addresses: array(
        partial({
          street: string(),
          city: string(),
        })
      ),
    }),
    description:
      "partial: should return success for { age: number, firstName: string, lastName: string, addresses: [ { street: string, city: string } ] }",
    value: {
      firstName: "Colonel",
      lastName: "Sanders",
      age: 99,
      addresses: [
        { city: "Someplace", street: "High street" },
        { street: "Lowstreet Five", city: 2000 },
      ],
    },
  },
  {
    decoder: partial({
      firstName: string(),
      lastName: string(),
      addresses: array(
        type({
          street: string(),
          city: string(),
        })
      ),
    }),
    description: "partial: should only be partial on the level of the decoder",
    value: {
      firstName: "Colonel",
      lastName: "Sanders",
      addresses: [
        { city: "Someplace", street: "High street" },
        { street: "Lowstreet Five" },
      ],
    },
  },
]);

Deno.test({
  name: "partial: should strip properties that are not defined in the decoder",
  fn: () => {
    const decoder = partial({
      firstName: string(),
      lastName: string(),
    });

    const result = decoder.decode({
      firstName: "Donald",
      lastName: "McRonald",
      age: 99,
    }) as Success<any>;

    assertEquals(result.success, true);
    assertEquals(result.value.age, undefined);
  },
});
