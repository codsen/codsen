// Match a whitespace-tolerant character sequence on the right

import { strict as assert } from "node:assert";

import { rightSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(rightSeq("X a  b  c", 0, "a", "b", "c"), {
  gaps: [
    [1, 2],
    [3, 5],
    [6, 8],
  ],
  leftmostChar: 2,
  rightmostChar: 8,
});
