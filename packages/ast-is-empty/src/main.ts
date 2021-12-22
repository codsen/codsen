/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import isObj from "lodash.isplainobject";

import { version as v } from "../package.json";

const version: string = v;

/**
 * Find out, is nested array/object/string/AST tree is empty
 */
function isEmpty(input: any): boolean | null {
  let i;
  let len;
  let res: boolean | null = true;
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }
    for (i = 0, len = input.length; i < len; i++) {
      res = isEmpty(input[i]);
      if (res === null) {
        return null;
      }
      if (!res) {
        return false;
      }
    }
  } else if (isObj(input)) {
    if (Object.keys(input).length === 0) {
      return true;
    }
    for (i = 0, len = Object.keys(input).length; i < len; i++) {
      res = isEmpty(input[Object.keys(input)[i]]);
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
