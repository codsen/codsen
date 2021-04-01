/**
 * ast-contains-only-empty-space
 * Does AST contain only empty space?
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-contains-only-empty-space/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');
var astMonkeyTraverse = require('ast-monkey-traverse');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

function empty(input) {
  if (typeof input === "string") {
    return !input.trim();
  }
  if (!["object", "string"].includes(_typeof__default['default'](input)) || !input) {
    return false;
  }
  var found = true;
  input = astMonkeyTraverse.traverse(input, function (key, val, innerObj, stop) {
    var current = val !== undefined ? val : key;
    if (typeof current === "string" && current.trim()) {
      found = false;
      stop.now = true;
    }
    return current;
  });
  return found;
}

exports.empty = empty;
