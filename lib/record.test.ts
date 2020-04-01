import { record } from "./record.ts";
import { number } from "./number.ts";

Deno.test({
  name: "RecordDecoder: Test",
  fn: () => {
    const decoder = record(number());
    const result = decoder.decode({ 0: "12", 1: "13" });
    console.log(result);
  }
});
