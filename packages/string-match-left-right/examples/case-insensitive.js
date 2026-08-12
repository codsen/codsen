// Match without letter-case sensitivity

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

assert.equal(matchRight("abcdef", 2, "D"), false);
assert.equal(matchRight("abcdef", 2, "D", { i: true }), "D");
