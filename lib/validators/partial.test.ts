import { assertEquals } from "../../test-deps.ts";
import { runFailureTestCases, runSuccessTestCases } from "./test-helpers.ts";
import { Failure, Success } from "../types.ts";
import { partial } from "./partial.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { array } from "./array.ts";
import { type } from "./type.ts";

runSuccessTestCases([
  {
    validator: partial({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "partial: should return success for { firstName: string, lastName: string, age: number }",
    value: { firstName: "Ghenghis", lastName: "Roundstone" },
  },
  {
    validator: partial({
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
      firstName: "Ghenghis",
      lastName: "Roundstone",
      address: { street: "High street" },
    },
  },
  {
    validator: partial({
      firstName: string(),
      lastName: string(),
      addresses: array(
        partial({
          street: string(),
          city: string(),
        }),
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
    validator: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: []",
    value: [],
  },
  {
    validator: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: '1'",
    value: "1",
  },
  {
    validator: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    validator: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: 1",
    value: 1,
  },
  {
    validator: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: null",
    value: null,
  },
  {
    validator: partial({ firstName: string(), lastName: string() }),
    description: "partial: should return failure for: undefined",
    value: undefined,
  },

  {
    validator: partial({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "partial: should return failure for { firstName: string, lastName: string, age: number }",
    value: { firstName: "Ghenghis", lastName: "Roundstone", age: "23" },
  },
  {
    validator: partial({
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
      firstName: "Ghenghis",
      lastName: "Roundstone",
      address: { street: "High street", city: 2000 },
    },
  },
  {
    validator: partial({
      firstName: string(),
      lastName: string(),
      addresses: array(
        partial({
          street: string(),
          city: string(),
        }),
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
    validator: partial({
      firstName: string(),
      lastName: string(),
      addresses: array(
        type({
          street: string(),
          city: string(),
        }),
      ),
    }),
    description:
      "partial: should only be partial on the level of the validator",
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
  name:
    "partial: should strip properties that are not defined in the validator",
  fn: () => {
    const validator = partial({
      firstName: string(),
      lastName: string(),
    });

    const result = validator.validate({
      firstName: "Ghenghis",
      lastName: "McGhenghis",
      age: 99,
    }) as Success<any>;

    assertEquals(result.success, true);
    assertEquals(result.value.age, undefined);
  },
});

Deno.test({
  name: "partial: should add error path information",
  fn: () => {
    const validator = partial({
      name: string(),
      age: number(),
      addresses: array(
        type({
          street: string(),
          city: string(),
        }),
      ),
    });

    const result = validator.validate({
      name: "Ghenghis",
      age: "99",
      addresses: [
        {
          street: "High street",
          city: "Someplace",
        },
        {
          street: "Low street",
          city: 2000,
        },
      ],
    }) as Failure;

    assertEquals(result.errors.length, 2);
    assertEquals(result.errors[0].path, ["age"]);
    assertEquals(result.errors[1].path, ["addresses", "1", "city"]);
  },
});
