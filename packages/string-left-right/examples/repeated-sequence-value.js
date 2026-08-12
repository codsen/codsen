// Match one or more repeated sequence values with an asterisk

import { strict as assert } from "node:assert";

import { rightSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(rightSeq("X a a a b", 0, "a*", "b"), {
  gaps: [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ],
  leftmostChar: 2,
  rightmostChar: 8,
});
