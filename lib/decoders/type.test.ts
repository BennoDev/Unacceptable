import { assertEquals } from "../../test-deps.ts";
import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { Success, Failure } from "../types.ts";
import { type } from "./type.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { array } from "./array.ts";

runSuccessTestCases([
  {
    decoder: type({}),
    description: "type: should return success for {}",
    value: { firstName: "Ronald", lastName: "MacDonald" },
  },
  {
    decoder: type({
      firstName: string(),
      lastName: string(),
    }),
    description:
      "type: should return success for { firstName: string, lastName: string }",
    value: { firstName: "Ronald", lastName: "MacDonald" },
  },
  {
    decoder: array(
      type({
        firstName: string(),
        lastName: string(),
      })
    ),
    description:
      "type: should return success for [{ firstName: string, lastName: string }]",
    value: [
      { firstName: "Ronald", lastName: "MacDonald" },
      { firstName: "Colonel", lastName: "Sanders" },
    ],
  },
  {
    decoder: type({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "type: should return success for { age: number, firstName: string, lastName: string }",
    value: { firstName: "Colonel", lastName: "Sanders", age: 99 },
  },
  {
    decoder: type({
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
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: {}",
    value: {},
  },
  {
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: []",
    value: [],
  },
  {
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: '1'",
    value: "1",
  },
  {
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: 1",
    value: 1,
  },
  {
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: null",
    value: null,
  },
  {
    decoder: type({ firstName: string(), lastName: string() }),
    description: "type: should return failure for: undefined",
    value: undefined,
  },
  {
    decoder: type({
      firstName: string(),
      lastName: string().withRule({
        name: "NotEmpty",
        fn: (value) => (value === "" ? "String can't be empty" : null),
      }),
    }),
    description:
      "type: should return failure for { firstName: string, lastName: string }",
    value: { firstName: "Ronald", lastName: "" },
  },
  {
    decoder: array(
      type({
        firstName: string(),
        lastName: string(),
      })
    ),
    description:
      "type: should return failure for [{ firstName: string, lastName: string }]",
    value: [
      { firstName: "Ronald", lastName: "MacDonald" },
      { firstName: "Colonel" },
    ],
  },
  {
    decoder: type({
      firstName: string(),
      lastName: string(),
      age: number(),
    }),
    description:
      "type: should return failure for { age: number, firstName: string, lastName: string }",
    value: { firstName: "Colonel", lastName: "Sanders", age: "99" },
  },
  {
    decoder: type({
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
  name: "type: should strip properties that are not defined in the decoder: 1",
  fn: () => {
    const decoder = type({
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

Deno.test({
  name: "type: should strip properties that are not defined in the decoder: 2",
  fn: () => {
    const decoder = type({
      firstName: string(),
      lastName: string(),
      address: type({
        street: string(),
        city: string(),
      }),
    });

    const result = decoder.decode({
      firstName: "Donald",
      lastName: "McRonald",
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
    const decoder = type({
      name: string(),
      age: number(),
      addresses: array(
        type({
          street: string(),
          city: string(),
        })
      ),
    });

    const result = decoder.decode({
      name: "Ronald",
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
