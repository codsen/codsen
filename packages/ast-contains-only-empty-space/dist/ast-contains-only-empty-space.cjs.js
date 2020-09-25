/**
 * ast-contains-only-empty-space
 * Returns Boolean depending if passed AST contain only empty space
 * Version: 1.9.15
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-contains-only-empty-space/
 */

'use strict';

var traverse = require('ast-monkey-traverse');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function containsOnlyEmptySpace(input) {
  if (typeof input === "string") {
    return !input.trim();
  }
  if (!["object", "string"].includes(_typeof(input)) || !input) {
    return false;
  }
  var found = true;
  input = traverse__default['default'](input, function (key, val, innerObj, stop) {
    var current = val !== undefined ? val : key;
    if (typeof current === "string" && current.trim()) {
      found = false;
      stop.now = true;
    }
    return current;
  });
  return found;
}

module.exports = containsOnlyEmptySpace;
