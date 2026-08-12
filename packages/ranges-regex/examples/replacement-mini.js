// Replacing values

import { strict as assert } from "node:assert";
import { rApply } from "../../ranges-apply/dist/ranges-apply.esm.js";
import { rRegex } from "../dist/ranges-regex.esm.js";

const source = "the typo in 'quick brow fox' sentence";
const ranges = rRegex(/\bbrow\b/g, source, "brown");

assert.deepEqual(ranges, [[19, 23, "brown"]]);
assert.equal(rApply(source, ranges), "the typo in 'quick brown fox' sentence");
