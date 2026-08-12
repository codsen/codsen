// Match repeated sequences on the left and include nearby whitespace

import { strict as assert } from "node:assert";

import { chompLeft } from "../dist/string-left-right.esm.js";

assert.equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2);
