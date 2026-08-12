// Inspect the ranges used to produce the collapsed result

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.deepEqual(collapse("one   two").ranges, [[3, 5]]);
