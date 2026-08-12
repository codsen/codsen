// Quick Take

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

assert.equal(matchRight("abcdefghi", 3, ["ef", "zz"]), "ef");
