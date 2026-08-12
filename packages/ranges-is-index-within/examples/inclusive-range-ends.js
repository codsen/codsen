// Include both range endpoints in the match

import { strict as assert } from "node:assert";

import { isIndexWithin } from "../dist/ranges-is-index-within.esm.js";

assert.equal(isIndexWithin(5, [[5, 10]], { inclusiveRangeEnds: true }), true);
