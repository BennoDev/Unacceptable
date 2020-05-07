import { TypeOf } from "../types.ts";
import { type } from "./type.ts";
import { string } from "./string.ts";
import { number } from "./number.ts";

const decoder = type({
  hey: string(),
  you: number()
});
const result = decoder.decode({
  hey: 0,
  you: "hey"
});

type Test = TypeOf<typeof decoder>;
console.log(JSON.stringify(result));
