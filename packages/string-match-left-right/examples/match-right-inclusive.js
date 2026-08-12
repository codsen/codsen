// Include the indexed character in a right-side match

import { strict as assert } from "node:assert";

import { matchRightIncl } from "../dist/string-match-left-right.esm.js";

assert.equal(matchRightIncl("abcdefghi", 3, ["def", "zzz"]), "def");
