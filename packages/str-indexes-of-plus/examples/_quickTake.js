/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import indx from "../dist/str-indexes-of-plus.esm.js";

// searches for string in a string, returns array:
assert.deepEqual(indx("abc-abc-abc-abc", "abc"), [0, 4, 8, 12]);

// all graphemes are counted as one, emoji too:
assert.deepEqual(
  indx("🐴-🦄", "🦄"),
  [2] // not [3] considering unicorn is 2-characters long
);

// you can offset the start of a search:
assert.deepEqual(indx("abczabc", "abc", 3), [4]);
