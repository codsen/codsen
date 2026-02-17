/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { isPlainObject as isObj } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

/**
 * Find out, is nested array/object/string/AST tree is empty
 */
function isEmpty(input: unknown): boolean | null {
  let res: boolean | null = true;
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }
    for (const value of input) {
      res = isEmpty(value);
      if (res === null) {
        return null;
      }
      if (!res) {
        return false;
      }
    }
  } else if (isObj(input)) {
    const keys = Object.keys(input);
    if (keys.length === 0) {
      return true;
    }
    for (const key of keys) {
      res = isEmpty(input[key]);
      if (res === null) {
        return null;
      }
      if (!res) {
        return false;
      }
    }
  } else if (typeof input === "string") {
    if (input.length !== 0) {
      return false;
    }
  } else {
    return null;
  }
  return res;
}

export { isEmpty, version };
