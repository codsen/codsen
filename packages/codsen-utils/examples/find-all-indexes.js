// Find overlapping substring occurrences

import { strict as assert } from "node:assert";

import { findAllIdx } from "../dist/codsen-utils.esm.js";

assert.deepEqual(findAllIdx("bananana", "ana"), [1, 3, 5]);
