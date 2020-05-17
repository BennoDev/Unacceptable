import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { intersection } from "./intersection.ts";
import { type } from "./type.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { array } from "./array.ts";

runSuccessTestCases([
  {
    decoder: intersection([
      type({ firstName: string() }),
      type({ lastName: string() }),
    ]),
    description:
      "intersection: should return success for { firstName: string } & { lastName: string }",
    value: {
      firstName: "Ronald",
      lastName: "MacDonald",
    },
  },
  {
    decoder: intersection([
      type({
        firstName: string(),
        lastName: string(),
      }),
      type({
        age: number(),
        address: type({
          street: string(),
          city: string(),
        }),
      }),
    ]),
    description:
      "intersection: should return success for { firstName: string, lastName: string } & { age: number, address: { street: string, city: string } }",
    value: {
      firstName: "Colonel",
      lastName: "Sanders",
      age: 99,
      address: {
        street: "Don't know",
        city: "Somewhere",
      },
    },
  },
  {
    decoder: intersection([
      string().withRule({
        name: "NotEmpty",
        fn: (value) => (value === "" ? "String cant be empty" : null),
      }),
      string().withRule({
        name: "IsNumberString",
        fn: (value) =>
          Number.isNaN(parseInt(value, 10))
            ? "String has to be parseable to number"
            : null,
      }),
    ]),
    description:
      "intersection: should return success for string:NotEmpty & string:IsNotEmpty",
    value: "24",
  },
]);

runFailureTestCases([
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: {}",
    value: {},
  },
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: []",
    value: [],
  },
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: '1'",
    value: "1",
  },
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: Symbol()",
    value: Symbol(),
  },
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: 1",
    value: 1,
  },
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: null",
    value: null,
  },
  {
    decoder: intersection([
      type({ firstName: string(), lastName: string() }),
      type({ age: number() }),
    ]),
    description: "intersection: should return failure for: undefined",
    value: undefined,
  },
  {
    decoder: intersection([string(), number()]),
    description: "intersection: should return failure for: number & string",
    value: 23,
  },
  {
    decoder: intersection([
      type({ firstName: string() }),
      type({ lastName: string() }),
    ]),
    description:
      "intersection: should return failure for: { firstName: string } & { lastName: string }",
    value: { lastName: "MacDonald" },
  },
  {
    decoder: type({
      firstName: string(),
      lastName: string(),
      address: intersection([
        type({ state: string(), country: string() }),
        type({ city: string(), street: string() }),
      ]),
    }),
    description:
      "intersection: should return failure for: { firstName: string, lastName: string, address: { state: string, country: string } & { street: string, city: string } }",
    value: {
      firstName: "Ronald",
      lastName: "MacDonald",
      address: {
        city: "Somewhere",
        street: "Highstreet one",
        state: "Best state",
      },
    },
  },
]);
