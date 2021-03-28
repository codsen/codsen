/**
 * ast-contains-only-empty-space
 * Does AST contain only empty space?
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-contains-only-empty-space/
 */

import { traverse } from 'ast-monkey-traverse';

function empty(input) {
  if (typeof input === "string") {
    return !input.trim();
  }
  if (!["object", "string"].includes(typeof input) || !input) {
    return false;
  }
  let found = true;
  input = traverse(input, (key, val, innerObj, stop) => {
    const current = val !== undefined ? val : key;
    if (typeof current === "string" && current.trim()) {
      found = false;
      stop.now = true;
    }
    return current;
  });
  return found;
}

export { empty };
