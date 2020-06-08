import { assertEquals } from "../../test-deps.ts";
import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { Success, Failure } from "../types.ts";
import { type } from "./type.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { array } from "./array.ts";

runSuccessTestCases([
  {
    validator: type({}),
    description: "type: should return success for {}",
    value: { firstName: "Ghenghis", lastName: "Roundstone" },
  },
  {
    validator: type({
      firstName: string(),
      lastName: string(),
    }),
    description:
      "type: should return success for { firstName: string, lastName: string }",
    value: { firstName: "Ghenghis", lastName: "Roundstone" },
  },
  {
    validator: array(
      type({
        firstName: string(),
        lastName: string(),
      })
    ),
    description:
      "type: should return success for [{ firstName: string, lastName: string }]",
    value: [
      { firstName: "Ghenghis", lastName: "Roundstone" },
      { firstName: "Colonel", lastName: "Sanders" },
    ],
  },
  {
    validator: type({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "type: should return success for { age: number, firstName: string, lastName: string }",
    value: { firstName: "Colonel", lastName: "Sanders", age: 99 },
  },
  {
    validator: type({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "type: should return success for { age: number, firstName: string, lastName: string, addresses: [ { street: string, city: string } ] }",
    value: {
      firstName: "Colonel",
      lastName: "Sanders",
      age: 99,
      addresses: [
        { street: "Highstreet One", city: "Someplace" },
        { street: "Lowstreet Five", city: "Somewhere" },
      ],
    },
  },
]);

runFailureTestCases([
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: {}",
    value: {},
  },
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: []",
    value: [],
  },
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: '1'",
    value: "1",
  },
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: 1",
    value: 1,
  },
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: null",
    value: null,
  },
  {
    validator: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: undefined",
    value: undefined,
  },
  {
    validator: type({
      firstName: string(),
      lastName: string().withRule({
        name: "NotEmpty",
        fn: (value) => (value === "" ? "String can't be empty" : null),
      }),
    }),
    description:
      "type: should return failure for { firstName: string, lastName: string }",
    value: { firstName: "Ghenghis", lastName: "" },
  },
  {
    validator: array(
      type({
        firstName: string(),
        lastName: string(),
      })
    ),
    description:
      "type: should return failure for [{ firstName: string, lastName: string }]",
    value: [
      { firstName: "Ghenghis", lastName: "Roundstone" },
      { firstName: "Colonel" },
    ],
  },
  {
    validator: type({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "type: should return failure for { age: number, firstName: string, lastName: string }",
    value: { firstName: "Colonel", lastName: "Sanders", age: "99" },
  },
  {
    validator: type({
      firstName: string(),
      lastName: string(),
      address: type({
        street: string(),
        city: string(),
      }),
    }),
    description:
      "type: should return failure for { age: number, firstName: string, lastName: string, address: { street: string, city: string } }",
    value: {
      firstName: "Colonel",
      lastName: "Sanders",
      age: "99",
      address: { street: "Highstreet One" },
    },
  },
]);

Deno.test({
  name:
    "type: should strip properties that are not defined in the validator: 1",
  fn: () => {
    const validator = type({
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
  name:
    "type: should strip properties that are not defined in the validator: 2",
  fn: () => {
    const validator = type({
      firstName: string(),
      lastName: string(),
      address: type({
        street: string(),
        city: string(),
      }),
    });

    const result = validator.validate({
      firstName: "Ghenghis",
      lastName: "McGhenghis",
      age: 99,
      address: {
        street: "High street",
        city: "Somewhere",
        zipCode: 2000,
      },
    }) as Success<any>;

    assertEquals(result.success, true);
    assertEquals(result.value.age, undefined);
    assertEquals(result.value.address.zipCode, undefined);
  },
});

Deno.test({
  name: "type: should add error path information",
  fn: () => {
    const validator = type({
      name: string(),
      age: number(),
      addresses: array(
        type({
          street: string(),
          city: string(),
        })
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
