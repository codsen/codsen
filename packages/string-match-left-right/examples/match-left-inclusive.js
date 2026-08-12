// Include the indexed character in a left-side match

import { strict as assert } from "node:assert";

import { matchLeftIncl } from "../dist/string-match-left-right.esm.js";

assert.equal(matchLeftIncl("abcdefghi", 3, ["bcd"]), "bcd");
