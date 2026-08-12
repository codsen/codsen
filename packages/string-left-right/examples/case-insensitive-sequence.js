// Match a character sequence without regard to letter case

import { strict as assert } from "node:assert";

import { rightSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(rightSeq("X A b C", 0, { i: true }, "a", "B", "c"), {
  gaps: [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
  leftmostChar: 2,
  rightmostChar: 6,
});
