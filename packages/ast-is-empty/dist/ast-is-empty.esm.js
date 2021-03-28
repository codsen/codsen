/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-is-empty/
 */

import isObj from 'lodash.isplainobject';

var version$1 = "2.0.11";

const version = version$1;
function isEmpty(input) {
  let i;
  let len;
  let res = true;
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
