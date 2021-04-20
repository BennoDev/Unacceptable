import { bench, runBenchmarks } from "./test-deps.ts";
import { v } from "./mod.ts";

bench({
  name: "type",
  runs: 1000000,
  func: ({ stop, start }) => {
    const validator = v.type({
      firstName: v.string(),
      lastName: v.string(),
      age: v.number(),
      meta: v.partial({
        contact: v.boolean(),
        interests: v.array(
          v.union([
            v.literal("OFFERS"),
            v.literal("BLOG_POSTS"),
            v.literal("NEWS"),
          ]),
        ),
      }),
      addresses: v.array(
        v.type({
          street: v.string(),
          city: v.string(),
          zipCode: v.number(),
        }),
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
    const validator = v.record(v.string());

    start();
    validator.validate({ prop1: "Hey", prop2: "Buds", prop3: 123 });
    stop();
  },
});

bench({
  name: "array",
  runs: 10,
  func: ({ start, stop }) => {
    const validator = v.array(v.string());
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
    const validator = v.union([
      v.literal(200),
      v.literal(201),
      v.literal(202),
      v.literal(204),
      v.literal(400),
      v.literal(401),
      v.literal(403),
      v.literal(404),
      v.literal(500),
    ]);

    start();
    validator.validate("200");
    stop();
  },
});

const Vector = v.tuple([v.number(), v.number(), v.number()]);

const Asteroid = v.type({
  type: v.literal("asteroid"),
  location: Vector,
  mass: v.number(),
});

const Planet = v.type({
  type: v.literal("planet"),
  location: Vector,
  mass: v.number(),
  population: v.number(),
  habitable: v.boolean(),
});

const Rank = v.union([
  v.literal("captain"),
  v.literal("first mate"),
  v.literal("officer"),
  v.literal("ensign"),
]);

const CrewMember = v.type({
  name: v.string(),
  age: v.number(),
  rank: Rank,
  home: Planet,
});

const Ship = v.type({
  type: v.literal("ship"),
  location: Vector,
  mass: v.number(),
  name: v.string(),
  crew: v.array(CrewMember),
});

const validator = v.union([Asteroid, Planet, Ship]);

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
