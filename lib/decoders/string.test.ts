import { runSuccessTestCases, runFailureTestCases } from "./test-helpers.ts";
import { string } from "./string.ts";
import { ValidationRule } from "../types.ts";

runSuccessTestCases([
  {
    decoder: string(),
    description: "string: should return success for: '1'",
    value: "1"
  },
  {
    decoder: string(),
    description: "string: should return success for: 'abdefghi'",
    value: "abdefghi"
  }
]);

runFailureTestCases([
  {
    decoder: string(),
    description: "string: should return failure for: {}",
    value: {}
  },
  {
    decoder: string(),
    description: "string: should return failure for: []",
    value: []
  },
  {
    decoder: string(),
    description: "string: should return failure for: 1",
    value: 1
  },
  {
    decoder: string(),
    description: "string: should return failure for: Symbol()",
    value: Symbol()
  },
  {
    decoder: string(),
    description: "string: should return failure for: undefined",
    value: undefined
  },
  {
    decoder: string(),
    description: "string: should return failure for: null",
    value: null
  },
  {
    decoder: string(),
    description: "string: should return failure for: false",
    value: false
  }
]);

// Test cases with rules
const isIpAddress: ValidationRule<string> = (value) => {
  const ipAddressRegex =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return ipAddressRegex.test(value)
    ? null
    : "String is not an ipv4 address";
};

const isEmail: ValidationRule<string> = (value) => {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(value) ? null : "Number is not an integer";
};

const isMacAddress: ValidationRule<string> = (value) => {
  const macAddressRegex =
    /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
  return macAddressRegex.test(value)
    ? null
    : "String is not a mac address";
};

const isNotEmpty: ValidationRule<string> = (value) =>
  value !== "" ? null : "Value can't be empty";
const containsUnderscore: ValidationRule<string> = (value) =>
  value.includes("_") ? null : "Value needs atleast one underscore";

runSuccessTestCases([
  {
    decoder: string().withRule(isIpAddress),
    description: "string: should return success with rule: ipAddress",
    value: "192.0.0.1"
  },
  {
    decoder: string().withRule(isMacAddress),
    description: "string: should return success with rule: macAddress",
    value: "00:01:02:03:04:05"
  },
  {
    decoder: string().withRule(isNotEmpty).withRule(containsUnderscore),
    description:
      "string: should return success with rules: isNotEmpty + containsUnderscore",
    value: "my_name"
  }
]);

runFailureTestCases([
  {
    decoder: string().withRule(isEmail),
    description: "string: should return failure with rule: isEmail",
    value: "not@validmail"
  }
]);
