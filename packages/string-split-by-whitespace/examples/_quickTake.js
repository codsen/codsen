// Quick Take

import { strict as assert } from "assert";
import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

// Split by whitespace is easy - use native String.prototype.split()
assert.deepEqual("abc  def ghi".split(/\s+/), ["abc", "def", "ghi"]);

const source = `\n     \n    a\t \nb    \n      \t`;

// this program is nearly equivalent to regex-based split:
assert.deepEqual(source.split(/\s+/), ["", "a", "b", ""]);
assert.deepEqual(splitByW(source), ["a", "b"]);
// regex-based split needs more filtration but it's native solution

// ADDITIONALLY...

// this program allows to exclude certain index ranges:
assert.deepEqual(
  splitByW("a b c d e", {
    ignoreRanges: [[0, 2]], // that's "a" and space after it
  }),
  ["b", "c", "d", "e"]
);
