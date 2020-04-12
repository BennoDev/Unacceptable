import { union } from "./union.ts";
import { literal } from "./literal.ts";
import { TypeOf } from "../types.ts";

const decoder = union([literal("12"), literal("23")]);
type Test = TypeOf<typeof decoder>;
