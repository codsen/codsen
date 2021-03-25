/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 3.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isPlainObject = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

var version$1 = "3.0.10";

var version = version$1;
function nonEmpty(input) {
  if (input == null) {
    return false;
  }
  if (Array.isArray(input) || typeof input === "string") {
    return !!input.length;
  }
  if (isPlainObject__default['default'](input)) {
    return !!Object.keys(input).length;
  }
  return typeof input === "number";
}

exports.nonEmpty = nonEmpty;
exports.version = version;
