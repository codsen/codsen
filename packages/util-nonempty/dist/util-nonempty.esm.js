/**
 * @name util-nonempty
 * @fileoverview Is the input (plain object, array, string or whatever) not empty?
 * @version 4.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/util-nonempty/}
 */

import isPlainObject from 'lodash.isplainobject';

var version$1 = "4.0.2";

const version = version$1;
function nonEmpty(input) {
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
