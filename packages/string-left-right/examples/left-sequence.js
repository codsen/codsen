// Match a whitespace-tolerant character sequence on the left

import { strict as assert } from "node:assert";

import { leftSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(leftSeq("a  b  c X", 8, "a", "b", "c"), {
  gaps: [
    [1, 3],
    [4, 6],
    [7, 8],
  ],
  leftmostChar: 0,
  rightmostChar: 6,
});
