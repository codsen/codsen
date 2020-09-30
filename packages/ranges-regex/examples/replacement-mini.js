/* eslint import/extensions:0, no-unused-vars:0 */

// Replacing values

import { strict as assert } from "assert";
import raReg from "../dist/ranges-regex.esm.js";
import apply from "../../ranges-apply";

// Task: fix "brow" typo using regex and Ranges

const source = "the typo in 'quick brow fox' sentence";
const ranges = [];

// 1. "brow"
const fix1 = raReg(/\bbrow\b/g, source);
// \b matches word boundary
assert.deepEqual(fix1, [[19, 23]]);
// apply ranges to get the result string:
assert.equal(apply(source, fix1), "the typo in 'quick  fox' sentence");

// But in Ranges terms, two element mean deletion range, not replacement!
// For replacement, you add a third element, value to put.
const fix2 = raReg(/\bbrow\b/g, source, "brown");
// \b matches word boundary
assert.deepEqual(fix2, [[19, 23, "brown"]]);
// apply ranges to get the result string:
assert.equal(apply(source, fix2), "the typo in 'quick brown fox' sentence");
