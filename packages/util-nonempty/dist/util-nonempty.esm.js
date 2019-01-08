/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.6.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty
 */

import isPlainObject from 'lodash.isplainobject';

function isArr(something) {
  return Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function nonEmpty(input) {
  if (arguments.length === 0 || input === undefined) {
    return false;
  } else if (isArr(input) || isStr(input)) {
    return input.length > 0;
  } else if (isPlainObject(input)) {
    return Object.keys(input).length > 0;
  } else if (isNum(input)) {
    return true;
  }
  return false;
}

export default nonEmpty;
