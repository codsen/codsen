/**
 * ast-contains-only-empty-space
 * Does AST contain only empty space?
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-contains-only-empty-space/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var astMonkeyTraverse = require('ast-monkey-traverse');

function empty(input) {
  if (typeof input === "string") {
    return !input.trim();
  }
  if (!["object", "string"].includes(typeof input) || !input) {
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
