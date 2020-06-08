import { assertEquals } from "../../test-deps.ts";
import { IValidator } from "../types.ts";

type TestCase = {
  validator: IValidator<any>;
  value: unknown;
  description: string;
};

export const runFailureTestCases = (cases: TestCase[]): void => {
  cases.forEach(({ validator, value, description }) => {
    Deno.test({
      name: description,
      fn: () => {
        assertEquals(validator.validate(value).success, false);
      },
    });
  });
};

export const runSuccessTestCases = (cases: TestCase[]): void => {
  cases.forEach(({ validator, value, description }) => {
    Deno.test({
      name: description,
      fn: () => {
        assertEquals(validator.validate(value).success, true);
      },
    });
  });
};
