/* eslint @typescript-eslint/no-explicit-any:0, @typescript-eslint/explicit-module-boundary-types:0 */

import isPlainObject from "lodash.isplainobject";
import { version } from "../package.json";

function nonEmpty(input: any): boolean {
  // deliberate ==, catches undefined and null
  if (input == null) {
    return false;
  }
  if (Array.isArray(input) || typeof input === "string") {
    return !!input.length;
  }
  if (isPlainObject(input)) {
    return !!Object.keys(input).length;
  }
  return typeof input === "number";
}

export { nonEmpty, version };
