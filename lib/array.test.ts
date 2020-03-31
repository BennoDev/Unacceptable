import { array } from "./array.ts";
import { number } from "./number.ts";

Deno.test({
  name: "Testing Run",
  fn: () => {
    const decoder = array(number());
    console.log(decoder.decode(["1", "2", "3", 4]));
  }
});
