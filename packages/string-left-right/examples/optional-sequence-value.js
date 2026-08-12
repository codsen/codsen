// Mark one sequence value as optional with a question mark

import { strict as assert } from "node:assert";

import { rightSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(rightSeq("X a c", 0, "a", "b?", "c"), {
  gaps: [
    [1, 2],
    [3, 4],
  ],
  leftmostChar: 2,
  rightmostChar: 4,
});
