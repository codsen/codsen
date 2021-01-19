/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.10.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isPlainObject = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

var version = "2.10.0";

/* eslint @typescript-eslint/no-explicit-any:0, @typescript-eslint/explicit-module-boundary-types:0 */
var version$1 = version;

function nonEmpty(input) {
  // deliberate ==, catches undefined and null
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
exports.version = version$1;
