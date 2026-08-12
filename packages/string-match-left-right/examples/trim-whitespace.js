// Skip whitespace before matching

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

assert.equal(matchRight("ab      cdef", 1, "cd"), false);
assert.equal(
  matchRight("ab      cdef", 1, "cd", { trimBeforeMatching: true }),
  "cd",
);
