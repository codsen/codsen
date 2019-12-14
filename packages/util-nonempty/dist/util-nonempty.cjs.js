/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.9.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/util-nonempty
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(require('lodash.isplainobject'));

var isArr = Array.isArray;
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

module.exports = nonEmpty;
