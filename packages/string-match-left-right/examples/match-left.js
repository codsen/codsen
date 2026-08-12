// Match a value immediately to the left of an index

import { strict as assert } from "node:assert";

import { matchLeft } from "../dist/string-match-left-right.esm.js";

assert.equal(matchLeft("abcdefghi", 3, ["ab", "zz"]), false);
