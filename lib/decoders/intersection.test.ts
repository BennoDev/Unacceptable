import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { assertEquals } from "../../test-deps.ts";
import { intersection } from "./intersection.ts";
import { type } from "./type.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";
import { array } from "./array.ts";
import { TypeOf, Success } from "../types.ts";
import { isSuccess } from "../result.ts";

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

Deno.test({
  name: "intersection: should merge decoded for complex structures",
  fn: () => {
    const tracking = type({
      visits: number(),
      amountSpent: number(),
    });
    const timestamps = type({
      createdAt: string(),
      updatedAt: string(),
    });
    const newProfile = type({
      firstName: string(),
      lastName: string(),
      addresses: array(
        type({
          street: string(),
          city: string(),
        })
      ),
      meta: intersection([tracking, timestamps]),
    });
    const oldProfile = type({
      age: number(),
      employment: type({
        salary: number(),
        title: string(),
      }),
      addresses: array(
        type({
          street: string(),
          zipcode: number(),
        })
      ),
      meta: tracking,
    });

    const profile = intersection([newProfile, oldProfile]);
    const result = profile.decode({
      firstName: "Ronald",
      lastName: "McDonald",
      addresses: [
        {
          street: "High street",
          city: "Somewhere",
          zipcode: 2000,
        },
      ],
      age: 82,
      employment: {
        salary: 100000000,
        title: "Clown",
      },
      meta: {
        visits: 200,
        amountSpent: 1250,
        createdAt: "20-10-2020",
        updatedAt: "15-05-2021",
      },
      pleaseOmit: "Yes",
    });

    assertEquals(isSuccess(result), true);
    assertEquals((result as any).value, {
      firstName: "Ronald",
      lastName: "McDonald",
      addresses: [
        {
          street: "High street",
          city: "Somewhere",
          zipcode: 2000,
        },
      ],
      age: 82,
      employment: {
        salary: 100000000,
        title: "Clown",
      },
      meta: {
        visits: 200,
        amountSpent: 1250,
        createdAt: "20-10-2020",
        updatedAt: "15-05-2021",
      },
    });
  },
});

Deno.test({
  name: "intersection: should merge decoded properly for arrays",
  fn: () => {
    const decoder = intersection([
      array(type({ key: string() })),
      array(type({ key2: number() })),
    ]);
    const result = decoder.decode([
      { key: "hey", key2: 3, key3: "4" },
      { key: "bud", key2: 12 },
    ]);

    assertEquals(isSuccess(result), true);
    assertEquals((result as any).value, [
      { key: "hey", key2: 3 },
      { key: "bud", key2: 12 },
    ]);
  },
});

Deno.test({
  name: "intersection: should properly handle decoded literals",
  fn: () => {
    const decoder = intersection([string(), string()]);
    const result = decoder.decode("123");

    assertEquals(isSuccess(result), true);
    assertEquals((result as any).value, "123");
  },
});
