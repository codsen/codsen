// Match an astral symbol as two UTF-16 code units

import { strict as assert } from "node:assert";
import { rightSeq } from "../dist/string-left-right.esm.js";

assert.deepEqual(rightSeq("x😀z", 0, "\ud83d", "\ude00"), {
  gaps: [],
  leftmostChar: 1,
  rightmostChar: 2,
});
