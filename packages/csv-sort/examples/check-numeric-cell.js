// Check whether a CSV cell is numeric

import { strict as assert } from "node:assert";

import { isNumeric } from "../dist/csv-sort.esm.js";

assert.equal(isNumeric("99.00"), true);
assert.equal(isNumeric("99 EUR"), false);
