/**
 * @name ast-contains-only-empty-space
 * @fileoverview Does AST contain only empty space?
 * @version 3.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-contains-only-empty-space/}
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
