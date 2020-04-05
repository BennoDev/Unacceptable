import { assertEquals } from "../../test-deps.ts";
import { IDecoder, ICustomizableDecoder } from "../types.ts";

type TestCase = {
  decoder: IDecoder<any> | ICustomizableDecoder<any>;
  value: unknown;
  description: string;
};

export const runFailureTestCases = (
  cases: TestCase[]
): void => {
  cases.forEach(({ decoder, value, description }) => {
    Deno.test({ name: description, fn: () => {
      assertEquals(decoder.decode(value).success, false);
    } });
  });
};

export const runSuccessTestCases = (
  cases: TestCase[]
): void => {
  cases.forEach(({ decoder, value, description }) => {
    Deno.test({ name: description, fn: () => {
      assertEquals(decoder.decode(value).success, true);
    } });
  });
};
