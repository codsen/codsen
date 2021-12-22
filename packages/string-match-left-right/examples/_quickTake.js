// Quick Take

import { strict as assert } from "assert";

import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// 3rd character is "d" because indexes start from zero.
// We're checking the string to the left of it, "bcd", inclusive of current character ("d").
// This means, "bcd" has to end with existing character and the other chars to the left
// must match exactly:
assert.equal(matchLeftIncl("abcdefghi", 3, ["bcd"]), "bcd");

// neither "ab" nor "zz" are to the left of 3rd index, "d":
assert.equal(matchLeft("abcdefghi", 3, ["ab", `zz`]), false);

// "def" is to the right of 3rd index (including it), "d":
assert.equal(matchRightIncl("abcdefghi", 3, ["def", `zzz`]), "def");

// One of values, "ef" is exactly to the right of 3rd index, "d":
assert.equal(matchRight("abcdefghi", 3, ["ef", `zz`]), "ef");
