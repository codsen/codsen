// Replacing values

import { strict as assert } from "assert";
import { rRegex } from "../dist/ranges-regex.esm.js";
import { rApply } from "../../ranges-apply";

// Task: fix "brow" typo using regex and Ranges

const source = "the typo in 'quick brow fox' sentence";

// 1. "brow"
const fix1 = rRegex(/\bbrow\b/g, source);
// \b matches word boundary
assert.deepEqual(fix1, [[19, 23]]);
// apply ranges to get the result string:
assert.equal(rApply(source, fix1), "the typo in 'quick  fox' sentence");

// But in Ranges terms, two elements mean deletion range, not replacement!
// For replacement, you add a third element, value to put.
const fix2 = rRegex(/\bbrow\b/g, source, "brown");
// \b matches word boundary
assert.deepEqual(fix2, [[19, 23, "brown"]]);
// apply ranges to get the result string:
assert.equal(rApply(source, fix2), "the typo in 'quick brown fox' sentence");
