// Combine optional and repeated sequence flags

import { strict as assert } from "node:assert";

import { rightSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(rightSeq("X b", 0, "a?*", "b"), {
  gaps: [[1, 2]],
  leftmostChar: 2,
  rightmostChar: 2,
});
