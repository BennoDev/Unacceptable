import { assertEquals } from "../test-deps.ts";
import { failure, isFailure, isSuccess, success } from "./result.ts";
import { ValidationError } from "./types.ts";

Deno.test({
  name: "Result: success",
  fn: () => {
    const value = "Hey";
    const result = success(value);
    assertEquals(result.success, true);
    assertEquals(result.value, value);
  },
});

Deno.test({
  name: "Result: failure",
  fn: () => {
    const errors: ValidationError[] = [
      { value: "Hey", message: "Error message" },
    ];
    const result = failure(errors);
    assertEquals(result.success, false);
    assertEquals(result.errors, errors);
  },
});

Deno.test({
  name: "Result: isSuccess",
  fn: () => {
    const successResult = success(0);
    assertEquals(isSuccess(successResult), true);

    const failureResult = failure([{ value: 0, message: "Error message" }]);
    assertEquals(isSuccess(failureResult), false);
  },
});

Deno.test({
  name: "Result: isFailure",
  fn: () => {
    const successResult = success(0);
    assertEquals(isFailure(successResult), false);

    const failureResult = failure([{ value: 0, message: "Error message" }]);
    assertEquals(isFailure(failureResult), true);
  },
});
