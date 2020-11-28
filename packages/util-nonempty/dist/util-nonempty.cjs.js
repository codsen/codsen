/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.10.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

'use strict';

var isPlainObject = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

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
  }
  if (isArr(input) || isStr(input)) {
    return input.length > 0;
  }
  if (isPlainObject__default['default'](input)) {
    return Object.keys(input).length > 0;
  }
  if (isNum(input)) {
    return true;
  }
  return false;
}

module.exports = nonEmpty;
