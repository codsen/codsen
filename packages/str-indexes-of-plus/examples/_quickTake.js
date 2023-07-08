// Quick Take

import { strict as assert } from "assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

// searches for string in a string, returns array:
assert.deepEqual(strIndexesOfPlus("abc-abc-abc-abc", "abc"), [0, 4, 8, 12]);

// all graphemes are counted as one, emoji too:
assert.deepEqual(
  strIndexesOfPlus("🐴-🦄", "🦄"),
  [2], // not [3] considering unicorn is 2-characters long
);

// you can offset the start of a search:
assert.deepEqual(strIndexesOfPlus("abczabc", "abc", 3), [4]);
