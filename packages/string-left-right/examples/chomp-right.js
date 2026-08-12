// Match repeated sequences on the right and include nearby whitespace

import { strict as assert } from "node:assert";

import { chompRight } from "../dist/string-left-right.esm.js";

assert.equal(chompRight("a b c d  c d  x", 2, "c", "d"), 13);
