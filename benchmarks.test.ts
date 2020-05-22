import { runBenchmarks, bench } from "./test-deps.ts";
import { array } from "./lib/decoders/array.ts";
import { string } from "./lib/decoders/string.ts";
import { number } from "./lib/decoders/number.ts";
import { boolean } from "./lib/decoders/boolean.ts";
import { union } from "./lib/decoders/union.ts";
import { literal } from "./lib/decoders/literal.ts";
import { record } from "./lib/decoders/record.ts";
import { type } from "./lib/decoders/type.ts";
import { partial } from "./lib/decoders/partial.ts";
import { intersection } from "./lib/decoders/intersection.ts";
import { tuple } from "./lib/decoders/tuple.ts";

// bench({
//   name: "type",
//   runs: 1000000,
//   func: ({ stop, start }) => {
//     const decoder = type({
//       firstName: string(),
//       lastName: string(),
//       age: number(),
//       meta: partial({
//         contact: boolean(),
//         interests: array(
//           union([literal("OFFERS"), literal("BLOG_POSTS"), literal("NEWS")])
//         ),
//       }),
//       addresses: array(
//         type({
//           street: string(),
//           city: string(),
//           zipCode: number(),
//         })
//       ),
//     });

//     start();
//     decoder.decode({
//       firstName: "Ronald",
//       lastName: "McDonald",
//       age: 80,
//       meta: {
//         interests: ["OFFERS", "NEWS"],
//       },
//       addresses: [
//         {
//           street: "High Street One",
//           city: "Someplace",
//           zipCode: 2000,
//         },
//       ],
//     });
//     stop();
//   },
// });

// bench({
//   name: "record",
//   runs: 1000000,
//   func: ({ stop, start }) => {
//     const decoder = record(string());

//     start();
//     decoder.decode({ prop1: "Hey", prop2: "Buds", prop3: 123 });
//     stop();
//   },
// });

// bench({
//   name: "array",
//   runs: 10,
//   func: ({ start, stop }) => {
//     const decoder = array(string());
//     const testData: string[] = [];
//     for (let i = 0; i < 1000000; i++) {
//       testData.push(`Number: ${i}`);
//     }

//     start();
//     decoder.decode(testData);
//     stop();
//   },
// });

// bench({
//   name: "union",
//   runs: 1000000,
//   func: ({ stop, start }) => {
//     const decoder = union([
//       literal(200),
//       literal(201),
//       literal(202),
//       literal(204),
//       literal(400),
//       literal(401),
//       literal(403),
//       literal(404),
//       literal(500),
//     ]);

//     start();
//     decoder.decode("200");
//     stop();
//   },
// });

// const Vector = tuple([number(), number(), number()]);

// const Asteroid = type({
//   type: literal("asteroid"),
//   location: Vector,
//   mass: number(),
// });

// const Planet = type({
//   type: literal("planet"),
//   location: Vector,
//   mass: number(),
//   population: number(),
//   habitable: boolean(),
// });

// const Rank = union([
//   literal("captain"),
//   literal("first mate"),
//   literal("officer"),
//   literal("ensign"),
// ]);

// const CrewMember = type({
//   name: string(),
//   age: number(),
//   rank: Rank,
//   home: Planet,
// });

// const Ship = type({
//   type: literal("ship"),
//   location: Vector,
//   mass: number(),
//   name: string(),
//   crew: array(CrewMember),
// });

// const decoder = union([Asteroid, Planet, Ship]);

// const good = {
//   type: "ship",
//   location: [1, 2, 3],
//   mass: 4,
//   name: "foo",
//   crew: [
//     {
//       name: "bar",
//       age: 44,
//       rank: "captain",
//       home: {
//         type: "planet",
//         location: [5, 6, 7],
//         mass: 8,
//         population: 1000,
//         habitable: true,
//       },
//     },
//   ],
// };

// const bad = {
//   type: "ship",
//   location: [1, 2, "a"],
//   mass: 4,
//   name: "foo",
//   crew: [
//     {
//       name: "bar",
//       age: 44,
//       rank: "captain",
//       home: {
//         type: "planet",
//         location: [5, 6, 7],
//         mass: 8,
//         population: "a",
//         habitable: true,
//       },
//     },
//   ],
// };

// bench({
//   name: "test:good",
//   runs: 1000000,
//   func: ({ start, stop }) => {
//     start();
//     decoder.decode(good);
//     stop();
//   },
// });

// bench({
//   name: "test:bad",
//   runs: 1000000,
//   func: ({ start, stop }) => {
//     start();
//     decoder.decode(bad);
//     stop();
//   },
// });

runBenchmarks();
