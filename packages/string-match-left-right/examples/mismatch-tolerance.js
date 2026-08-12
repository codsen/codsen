// Tolerate a missing character

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

assert.equal(matchRight("a<!->z", 0, "<!-->"), false);
assert.equal(matchRight("a<!->z", 0, "<!-->", { maxMismatches: 1 }), "<!-->");
