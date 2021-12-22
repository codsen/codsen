// Quick Take

import { strict as assert } from "assert";

import { lineCol, getLineStartIndexes } from "../dist/line-column-mini.esm.js";

// index 14 is letter "k" on the fourth line:
assert.deepEqual(lineCol("abc\ndef\r\nghi\njkl", 14), {
  line: 4,
  col: 2,
});

// ---------------------------------------------------------

// if you know you might query multiple times, use caching
const lineIndexes = getLineStartIndexes("abc\ndef\r\nghi\njkl");
assert.deepEqual(lineCol(lineIndexes, 14), {
  line: 4,
  col: 2,
});
// other queries will be by magnitude faster:
assert.deepEqual(lineCol(lineIndexes, 15), {
  line: 4,
  col: 3,
});

// by the way...
assert.deepEqual(lineCol(lineIndexes, 99), null);
