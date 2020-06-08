import { runBenchmarks, bench } from "./test-deps.ts";
import { array } from "./lib/validators/array.ts";
import { string } from "./lib/validators/string.ts";
import { number } from "./lib/validators/number.ts";
import { boolean } from "./lib/validators/boolean.ts";
import { union } from "./lib/validators/union.ts";
import { literal } from "./lib/validators/literal.ts";
import { record } from "./lib/validators/record.ts";
import { type } from "./lib/validators/type.ts";
import { partial } from "./lib/validators/partial.ts";
import { tuple } from "./lib/validators/tuple.ts";

bench({
  name: "type",
  runs: 1000000,
  func: ({ stop, start }) => {
    const validator = type({
      firstName: string(),
      lastName: string(),
      age: number(),
      meta: partial({
        contact: boolean(),
        interests: array(
          union([literal("OFFERS"), literal("BLOG_POSTS"), literal("NEWS")])
        ),
      }),
      addresses: array(
        type({
          street: string(),
          city: string(),
          zipCode: number(),
        })
      ),
    });

    start();
    validator.validate({
      firstName: "Ghenghis",
      lastName: "Roundstone",
      age: 80,
      meta: {
        interests: ["OFFERS", "NEWS"],
      },
      addresses: [
        {
          street: "High Street One",
          city: "Someplace",
          zipCode: 2000,
        },
      ],
    });
    stop();
  },
});

bench({
  name: "record",
  runs: 1000000,
  func: ({ stop, start }) => {
    const validator = record(string());

    start();
    validator.validate({ prop1: "Hey", prop2: "Buds", prop3: 123 });
    stop();
  },
});

bench({
  name: "array",
  runs: 10,
  func: ({ start, stop }) => {
    const validator = array(string());
    const testData: string[] = [];
    for (let i = 0; i < 1000000; i++) {
      testData.push(`Number: ${i}`);
    }

    start();
    validator.validate(testData);
    stop();
  },
});

bench({
  name: "union",
  runs: 1000000,
  func: ({ stop, start }) => {
    const validator = union([
      literal(200),
      literal(201),
      literal(202),
      literal(204),
      literal(400),
      literal(401),
      literal(403),
      literal(404),
      literal(500),
    ]);

    start();
    validator.validate("200");
    stop();
  },
});

const Vector = tuple([number(), number(), number()]);

const Asteroid = type({
  type: literal("asteroid"),
  location: Vector,
  mass: number(),
});

const Planet = type({
  type: literal("planet"),
  location: Vector,
  mass: number(),
  population: number(),
  habitable: boolean(),
});

const Rank = union([
  literal("captain"),
  literal("first mate"),
  literal("officer"),
  literal("ensign"),
]);

const CrewMember = type({
  name: string(),
  age: number(),
  rank: Rank,
  home: Planet,
});

const Ship = type({
  type: literal("ship"),
  location: Vector,
  mass: number(),
  name: string(),
  crew: array(CrewMember),
});

const validator = union([Asteroid, Planet, Ship]);

const good = {
  type: "ship",
  location: [1, 2, 3],
  mass: 4,
  name: "foo",
  crew: [
    {
      name: "bar",
      age: 44,
      rank: "captain",
      home: {
        type: "planet",
        location: [5, 6, 7],
        mass: 8,
        population: 1000,
        habitable: true,
      },
    },
  ],
};

const bad = {
  type: "ship",
  location: [1, 2, "a"],
  mass: 4,
  name: "foo",
  crew: [
    {
      name: "bar",
      age: 44,
      rank: "captain",
      home: {
        type: "planet",
        location: [5, 6, 7],
        mass: 8,
        population: "a",
        habitable: true,
      },
    },
  ],
};

bench({
  name: "test:good",
  runs: 1000000,
  func: ({ start, stop }) => {
    start();
    validator.validate(good);
    stop();
  },
});

bench({
  name: "test:bad",
  runs: 1000000,
  func: ({ start, stop }) => {
    start();
    validator.validate(bad);
    stop();
  },
});

runBenchmarks();
