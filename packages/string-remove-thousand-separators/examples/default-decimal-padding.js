// Pad a single decimal digit while removing thousand separators

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(remSep("100,000.2"), "100000.20");
assert.equal(remSep("100 000,2"), "100000,20");
assert.equal(remSep("100'000.2"), "100000.20");
