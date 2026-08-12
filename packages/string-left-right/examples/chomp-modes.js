// Control how chomp functions include surrounding whitespace

import { strict as assert } from "node:assert";

import { chompLeft, chompRight } from "../dist/string-left-right.esm.js";

const leftSource = "a\n  b c b c  x y";

assert.equal(chompLeft(leftSource, 13, { mode: 0 }, "b", "c"), 2);
assert.equal(chompLeft(leftSource, 13, { mode: 1 }, "b", "c"), 4);
assert.equal(chompLeft(leftSource, 13, { mode: 2 }, "b", "c"), 2);
assert.equal(chompLeft(leftSource, 13, { mode: 3 }, "b", "c"), 1);

const rightSource = "a b c d  c d  \nx";

assert.equal(chompRight(rightSource, 2, { mode: 0 }, "c", "d"), 14);
assert.equal(chompRight(rightSource, 2, { mode: 1 }, "c", "d"), 12);
assert.equal(chompRight(rightSource, 2, { mode: 2 }, "c", "d"), 14);
assert.equal(chompRight(rightSource, 2, { mode: 3 }, "c", "d"), 15);
