/**
 * ast-contains-only-empty-space
 * Returns Boolean depending if passed AST contain only empty space
 * Version: 1.9.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-contains-only-empty-space
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var traverse = _interopDefault(require('ast-monkey-traverse'));

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
    return !input.trim().length;
  } else if (!["object", "string"].includes(_typeof(input)) || !input) {
    return false;
  }
  var found = true;
  input = traverse(input, function (key, val, innerObj, stop) {
    var current = val !== undefined ? val : key;
    if (typeof current === "string" && current.trim().length) {
      found = false;
      stop.now = true;
    }
    return current;
  });
  return found;
}

module.exports = containsOnlyEmptySpace;
