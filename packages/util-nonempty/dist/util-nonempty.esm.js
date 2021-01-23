/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 3.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

import isPlainObject from 'lodash.isplainobject';

var version = "3.0.0";

/* eslint @typescript-eslint/no-explicit-any:0, @typescript-eslint/explicit-module-boundary-types:0 */
const version$1 = version;

function nonEmpty(input) {
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

export { nonEmpty, version$1 as version };
