import { isPlainObject } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

function nonEmpty(input: unknown): boolean {
  // "==" catches undefined and null
  if (input == null) {
    return false;
  }
  if (Array.isArray(input) || typeof input === "string") {
    return !!input.length;
  }
  if (isPlainObject(input)) {
    return !!Object.keys(input as object).length;
  }
  return typeof input === "number";
}

export { nonEmpty, version };
