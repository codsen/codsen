// Classify CSV cells before sorting

import { strict as assert } from "node:assert";

import { findType } from "../dist/csv-sort.esm.js";

assert.equal(findType("£ 100.01"), "numeric");
assert.equal(findType("Invoice payment"), "text");
assert.equal(findType(" \t "), "empty");
