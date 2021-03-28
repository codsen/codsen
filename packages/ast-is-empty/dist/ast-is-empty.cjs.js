/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-is-empty/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "2.0.11";

var version = version$1;
function isEmpty(input) {
  var i;
  var len;
  var res = true;
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
  } else if (isObj__default['default'](input)) {
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

exports.isEmpty = isEmpty;
exports.version = version;
